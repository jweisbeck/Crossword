
/**
* Jesse Weisbeck's Crossword Puzzle (for all 3 people left who want to play them)
*
*/
(function($){
	$.fn.crossword = function(entryData) {
			/*
				Qurossword Puzzle: a javascript + jQuery crossword puzzle
				"light" refers to a white box - or an input

				DEV NOTES: 
				- activePosition and activeClueIndex are the primary vars that set the ui whenever there's an interaction
				- This puzzle isn't designed to securely hide answerers. A user can see answerers in the js source
					- An xhr provision can be added later to hit an endpoint on keyup to check the answerer
				- The ordering of the array of problems doesn't matter. The position & orientation properties is enough information
				- Puzzle authors must provide a starting x,y coordinates for each entry
				- Entry orientation must be provided in lieu of provided ending x,y coordinates (script could be adjust to use ending x,y coords)
				- Answers are best provided in lower-case, and can NOT have spaces - will add support for that later
			*/
			
			var puzz = {}; // put data array in object literal to namespace it into safety
			puzz.data = entryData;
			
			// append clues markup after puzzle wrapper div
			// This should be moved into a configuration object
			this.after('<div id="puzzle-clues"><h2>Across</h2><ul id="across"></ul><h2>Down</h2><ul id="down"></ul></div>');
			
			// initialize some variables
			var tbl = ['<table id="puzzle">'],
			    puzzEl = this,
				clues = $('#puzzle-clues'),
				clueLiEls,
				coords,
				entryCount = puzz.data.length,
				entries = [], 
				rows = [],
				cols = [],
				solved = [],
				targetProblem,
				currVal,
				valToCheck,
				tabindex,
				activePosition = 0,
				activeClueIndex = 0,
				currSelectedInput,
				currOri,
				targetInput,
				mode;
		
		
			var puzInit = {
				
				init: function() {
					currOri = 'across'; // app's init orientation could move to config object
					
					// Reorder the problems array ascending by POSITION
					puzz.data.sort(function(a,b) {
						return a.position - b.position;
					});

					// Set keyup handlers for the 'entry' inputs that will be added presently
					puzzEl.delegate('input', 'keyup', function(e){

						if ( e.keyCode === 9) { // tabbing should always bounce back to clue lists
							return false;
						} else if (
							e.keyCode === 37 ||
							e.keyCode === 38 ||
							e.keyCode === 39 ||
							e.keyCode === 40 ||
							e.keyCode === 8 ||
							e.keyCode === 46 ) {
								
							mode = "interacting";
							nav.nextPrevNav(e);
							e.preventDefault();
							return false;
						}
						
						// solving mode enacted only when user strikes a key not listed above, on an input
						mode = 'interacting';
						// check the answer and move user to next entry cell if not solved or at last input in group
						
						//puzInit.checkAnswer(e); // temp. disabled - bglobe puz parse doesn't provide entries metadata
						
						currOri === 'across' ? nav.nextPrevNav(e, 39) : nav.nextPrevNav(e, 40);
						
						
						e.preventDefault();					
					});
			
					// tab navigation handler setup
					puzzEl.delegate('input', 'keydown', function(e) {
						if (e.keyCode === 9) {
							console.log(currOri);
							mode = "setting ui";
							nav.checkEntry(e);
							e.preventDefault();
							
						}						
					});
					
				
					puzzEl.delegate('input', 'click', function(e) {
						mode = 'setting ui';
						nav.checkEntry(e);
						e.preventDefault();
					})

					
					// click/tab clues 'navigation' handler setup
					clues.delegate('li', 'click', function(e) {
						nav.checkNav(e);
						mode = 'setting ui';					
						e.preventDefault(); 
					});
					
					
					// highlight the letter in selected 'light' - better ux than making user highlight letter with second action
					puzzEl.delegate('#puzzle', 'click', function(e) {
						$(e.target).focus();
						$(e.target).select();
					});
					
					// Build the puzzle table & clues ...
					puzInit.calcCoords();
					
					// Puzzle clues added to DOM in calcCoords(), so now immediately put mouse focus on first clue
					clueLiEls = $('#puzzle-clues li');
					$('#' + currOri + ' li' ).eq(0).addClass('clues-active').focus();
									
					puzInit.buildTable();
					puzInit.buildEntries();
										
				},
				
				/*
					- Given beginning coordinates, calculate all coordinates for entries, puts them into entries array
					- Builds clue markup and puts screen focus on the first one
				*/
				calcCoords: function() {
					/*
						Calculate all puzzle entry coordinates, put into entries array
					*/
					for (var i = 0, p = entryCount; i < p; ++i) {		
						// set up array of coordinates for each problem
						entries.push(i);
						entries[i] = [];

						for (var x=0, j = puzz.data[i].answer.length; x < j; ++x) {
							entries[i].push(x);
							coords = puzz.data[i].orientation === 'across' ? "" + puzz.data[i].startx++ + "," + puzz.data[i].starty + "" : "" + puzz.data[i].startx + "," + puzz.data[i].starty++ + "" ;
							entries[i][x] = coords; 
						}

						// while we're in here, add clues to DOM!
						$('#' + puzz.data[i].orientation).append('<li tabindex="1" data-position="' + i + '">' + puzz.data[i].position + ". " + puzz.data[i].clue + '</li>'); 
					}				
					
					// Calculate rows/cols by finding max coords of each entry, then picking the highest
					for (var i = 0, p = entryCount; i < p; ++i) {
						for (var x=0; x < entries[i].length; x++) {
							cols.push(entries[i][x].split(',')[0]);
							rows.push(entries[i][x].split(',')[1]);
						};
					}

					rows = Math.max.apply(Math, rows) + "";
					cols = Math.max.apply(Math, cols) + "";
					
				},
				
				/*
					Build the table markup
					- adds [data-coords] to each <td> cell
				*/
				buildTable: function() {
					for (var i=1; i <= rows; ++i) {
						tbl.push("<tr>");
							for (var x=1; x <= cols; ++x) {
								tbl.push('<td data-coords="' + x + ',' + i + '"></td>');		
							};
						tbl.push("</tr>");
					};

					tbl.push("</table>");
					puzzEl.append(tbl.join(''));
				},
				
				/*
					Builds entries into table
					- Adds entry class(es) to <td> cells
					- Adds tabindexes to <inputs> 
				*/
				buildEntries: function() {
					var puzzCells = $('#puzzle td'),
						light,
						$groupedLights,
						hasOffset = false,
						positionOffset = entryCount - puzz.data[puzz.data.length-1].position; // diff. between total ENTRIES and highest POSITIONS
						
					for (var x=1, p = entryCount; x <= p; ++x) {
						var letters = puzz.data[x-1].answer.split('');

						for (var i=0; i < entries[x-1].length; ++i) {
							light = $(puzzCells +'[data-coords="' + entries[x-1][i] + '"]');
							
							// check if POSITION property of the entry on current go-round is same as previous. 
							// If so, it means there's an across & down entry for the position.
							// Therefore you need to subtract the offset when applying the entry class.
							if(x > 1 ){
								if (puzz.data[x-1].position === puzz.data[x-2].position) {
									hasOffset = true;
								};
							}
							
							if($(light).empty()){
								$(light)
									.addClass('entry-' + (hasOffset ? x - positionOffset : x) + ' position-' + (x-1) )
									.append('<input maxlength="1" name="' + letters[x-2] + '" val="" type="text" tabindex="-1" />');
							}
						};
						
					};	
					
					// Put entry number in first 'light' of each entry, skipping it if already present
					for (var i=1, p = entryCount; i < p; ++i) {
						$groupedLights = $('.entry-' + i);
						if(!$('.entry-' + i +':eq(0) span').length){
							$groupedLights.eq(0)
								.append('<span>' + puzz.data[i].position + '</span>');
						}
					}	
					
					util.highlightEntry();
					$('.active').eq(0).focus();
					$('.active').eq(0).select();
										
				},
				
				/*
					- Checks current entry input group value against answer
					- If not complete, auto-selects next input for user
				*/
				checkAnswer: function(e) {
					
					var light = $(e.target).parent(),
						toCheck = util.getClasses(light, 'position');
										
					for (var i=0, c = toCheck.length; i < c; ++i) {
						targetProblem = toCheck[i].split('-')[1];
						valToCheck = puzz.data[targetProblem].answer.toLowerCase();
						
						if(util.checkSolved(valToCheck)){
							return false;
						}
						
						currVal = $('.position-' + (targetProblem) + ' input')
							.map(function() {								
						  		return $(this)
									.val()
									.toLowerCase();
							})
							.get()
							.join('');
						
						if(valToCheck === currVal){							
							for (var x=0, e = entries[targetProblem].length; x < e; ++x) {

								$('td[data-coords="' + entries[targetProblem][x] + '"]')
									.addClass('done');
			
								$('.active')
									.removeClass('active');	

								// grey out and strike through clue for clear visual feedback
								$('.clues-active').addClass('clue-done');
								
								solved.push(valToCheck);
								return;

							}
						}
						
						
						// User not yet at last input, so auto-select next one!						
						if(entries[targetProblem].length > currVal.length && currVal !== "" && currOri !== ""){
							currOri === 'across' ? nav.nextPrevNav(e, 39) : nav.nextPrevNav(e, 40);
						}
						
					};
				}
								
			} // end puzInit object
			

			var nav = {
				
				nextPrevNav: function(e, override) {
					//console.log(currOri);
					$('.active').removeClass('active');
					
					if(override) e.which = override;

					var el = $(e.target),
					p = el.parent(),
					ps = el.parents();
					
					// need to figure out orientation up front, before we attempt to highlight an entry
					switch(e.which) {
						case 39:
						case 8:
						case 46:
						case 37:
							currOri = 'across';
							break;
						case 38:
						case 40:
							currOri = 'down';
							break;
						default:
							break;
					}
					
					// find and highlight the right group of inputs
					// if user hits an intersection and the opposite entry happens to start here,
					// don't change the orientation. Orientation only changes in 'setting ui' mode
					util.getActivePositionFromClassGroup(el);
					util.highlightEntry();
					util.highlightClue();
					
					selector = '.position-' + activePosition + ' input';
					/*
						left/right/up/down keystrokes
					*/
					switch(e.which) {
						case 39:
							// left key
							p
								.next()
								.find('input')
								.select()
								.addClass('active');
							break;
						
						case 8:
						case 46:
						case 37:
							// right key
							p
								.prev()
								.find('input')
								.select()
								.addClass('active');
							break;

						case 40:
							//down key
							ps
								.next('tr')
								.find(selector)
								.select()
								.addClass('active');
							break;

						case 38:
						 	// up key
							ps
								.prev('tr')
								.find(selector)
								.select()
								.addClass('active');
							break;

						default:
						break;
					}
										
				},

				tabNav: function(e) {
					//activePosition = activePosition >= clueLiEls.length ? 0 : activePosition;
					//entryInputGroup ? entryInputGroup.removeClass('active') : null;
					$('.clues-active').removeClass('clues-active');
					$('.active').removeClass('active');


									
					// go back to first clue if tabbed past the end of the list
					//goToEntry === clueLiEls.eq(clueLiEls.length) + 1 ? util.highlightEntry(1) : util.highlightEntry(goToEntry);						
					//var goToEntry = $(e.target).data('position') + 1;
					//$(clueLiEls + '[data-position=' + goToEntry + ']').addClass('clues-active');
					console.log($(e.target).parent());
					activePosition = $(e.target).parent().data('position');
					
					util.getSkips(activePosition);
					util.highlightEntry();
					util.highlightClue();
									
					$('.active').eq(0).focus();
					$('.active').eq(0).select();
				
					// store orientation for 'smart' auto-selecting next input
					currOri = $('.clues-active').parent('ul').prop('id');
					var currentIndex = clueLiEls.index(e.target);
					var next = clueLiEls.index(clueLiEls[currentIndex+1]);
					activePosition = activePosition >= clueLiEls.length ? 0 : next;

					console.log('nav.tavNav() reports activePosition as: '+activePosition);	
											
				},				
			
				checkNav: function(e) {
					var target;
					
					$('.clues-active').removeClass('clues-active');
					$('.active').removeClass('active');

					target = e.target;
					activePosition = $(e.target).data('position');
					
					util.highlightEntry();
					util.highlightClue();
										
					$('.active').eq(0).focus();
					$('.active').eq(0).select();
					
					// store orientation for 'smart' auto-selecting next input
					currOri = $('.clues-active').parent('ul').prop('id');
										
					activeClueIndex = $(clueLiEls).index(e.target);
					console.log('checkNav() activeClueIndex: '+activeClueIndex);
					
				},
			
				// Sets activePosition var and adds active class to current entry
				checkEntry: function(e) {
					var classes, next, clue, e1Ori, e2Ori, e1Cell, e2Cell;
					
					if(e.keyCode === 9){
						// handle tabbing through problems, which keys off clues and requires different handling
						
						activeClueIndex = activeClueIndex === clueLiEls.length-1 ? 0 : ++activeClueIndex;
					
						$('.clues-active').removeClass('.clues-active');
						
						util.getSkips();
						
						next = $(clueLiEls[activeClueIndex]);
						currOri = next.parent().prop('id');
						activePosition = $(next).data('position');
												
					} else {
					
						activeClueIndex = activeClueIndex === clueLiEls.length-1 ? 0 : ++activeClueIndex;
					
						util.getActivePositionFromClassGroup(e.target);
						
						clue = $(clueLiEls + '[data-position=' + activePosition + ']');
						activeClueIndex = $(clueLiEls).index(clue);
						//console.log('checkEntry() not tab activeClueIndex: '+activeClueIndex);
					}
						
						util.highlightEntry();
						util.highlightClue();

					
					//console.log('nav.checkEntry() reports activePosition as: '+activePosition);	
				}
				
			} // end nav object

			
			var util = {
				highlightEntry: function() {
					$('.position-' + activePosition + ' input').addClass('active');
					$('.active').removeClass('active');	
					$('.position-' + activePosition + ' input').addClass('active');
					$('.active').eq(0).focus();
					$('.active').eq(0).select();
				},
				
				highlightClue: function() {
					var clue;
					
					$('.clues-active').removeClass('clues-active');
					$(clueLiEls + '[data-position=' + activePosition + ']').addClass('clues-active');
					
					if (mode === 'interacting') {
						clue = $(clueLiEls + '[data-position=' + activePosition + ']');
						activeClueIndex = $(clueLiEls).index(clue);
					};
				},
				
				getClasses: function(light, type) {
					if (!light.length) { return false };
					
					var classes = $(light).prop('class').split(' '),
					classLen = classes.length,
					positions = []; 

					// pluck out just the position classes
					for(var i=0; i < classLen; ++i){
						if (!classes[i].indexOf(type) ) {
							positions.push(classes[i]);
						}
					}
					
					return positions;
				},

				getSkips: function() {
					if ($(clueLiEls[activeClueIndex]).hasClass('clue-done')){
						activeClueIndex = activeClueIndex === clueLiEls.length-1 ? 0 : ++activeClueIndex;
						util.getSkips(activeClueIndex);						
					} else {
						return false;
					}
				},
				
				checkSolved: function(valToCheck) {
					for (var i=0, s=solved.length; i < s; i++) {
						if(valToCheck === solved[i]){
							return true;
						}

					};
				},
				
				getActivePositionFromClassGroup: function(el){
						classes = util.getClasses($(el).parent(), 'position');

						if(classes.length > 1){
							// get orientation for each reported position
							e1Ori = $(clueLiEls + '[data-position=' + classes[0].split('-')[1] + ']').parent().prop('id');
							e2Ori = $(clueLiEls + '[data-position=' + classes[1].split('-')[1] + ']').parent().prop('id');

							// test if clicked input is first in series. If so, and it intersects with
							// entry of opposite orientation, switch to select this one instead
							e1Cell = $('.position-' + classes[0].split('-')[1] + ' input').index(el);
							e2Cell = $('.position-' + classes[1].split('-')[1] + ' input').index(el);
							
							if(mode !== "interacting"){
								currOri = e1Cell === 0 ? e1Ori : e2Ori; // change orientation if cell clicked was first in a entry of opposite direction
							}

							if(e1Ori === currOri){
								activePosition = classes[0].split('-')[1];		
							} else if(e2Ori === currOri){
								activePosition = classes[1].split('-')[1];
							}
						} else {
							activePosition = classes[0].split('-')[1];						
						}
				}
				
			} // end util object

				
			puzInit.init();
	
							
	}
	
})(jQuery);