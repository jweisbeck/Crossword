/*
* Jesse Weisbeck's Crossword Puzzle 
*
* modified by Matej Jurko
*/
(function($){
	$.fn.crossword = function(entryData) {
			/*
				Qurossword Puzzle: a javascript + jQuery crossword puzzle
				"light" refers to a white box - or an input

				DEV NOTES: 
				- activePosition and activeClueIndex are the primary vars that set the ui whenever there's an interaction
				- 'Entry' is a puzzler term used to describe the group of letter inputs representing a word solution
				- This puzzle isn't designed to securely hide answerers. A user can see answerers in the js source
					- An xhr provision can be added later to hit an endpoint on keyup to check the answerer
				- The ordering of the array of problems doesn't matter. The position & orientation properties is enough information
				- Puzzle authors must provide a starting x,y coordinates for each entry
				- Entry orientation must be provided in lieu of provided ending x,y coordinates (script could be adjust to use ending x,y coords)
				- Answers are best provided in lower-case, and can NOT have spaces - will add support for that later
			*/
			
			var puzz = {}; // put data array in object literal to namespace it into safety
			puzz.data = entryData.words;
			puzz.chars = entryData.chars;
			puzz.answer = entryData.answer;
			
			// append clues markup after puzzle wrapper div
			// This should be moved into a configuration object
			$("#puzzle-wrapper").before(`
				<h1>Word shuffle</h1>
				<p>Mix letters below to find words. Some of theese letters are part of a key. 
				You win when you correctly guess all letters in a key. Good luck
				</p><div id="puzzle-clues">
				<ol id="across"></ol></div>
				<table style="display:none;" char-index="6"><tr><td></td></tr></table>`
			);
			
			// initialize some variables
			var tbl = ['<table id="puzzle" class="crosswordtable">'],
			    puzzEl = this,
				clues = $('#puzzle-clues'),
				clueLiEls,
				coords,
				entryCount = puzz.data.length,
				entries = [], 
				rows = [],
				cols = [],
				solved = [],
				tabindex,
				$actives,
				activePosition = 0,
				activeClueIndex = 0,
				currOri,
				targetInput,
				mode = 'interacting',
				solvedToggle = false,
				z = 0,
				formattedKeys = [];

			var puzInit = {
				
				init: function() {
					currOri = 'across'; // app's init orientation could move to config object
					
					// Reorder the problems array ascending by POSITION
					puzz.data.sort(function(a,b) {
						return a.position - b.position;
					});

					// Set keyup handlers for the 'entry' inputs that will be added presently
					puzzEl.delegate('input', 'keyup', function(e){
						mode = 'interacting';
						
						
						// need to figure out orientation up front, before we attempt to highlight an entry
						switch(e.which) {
							case 39:
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
						
						if ( e.keyCode === 9) {
							return false;
						} else if (
							e.keyCode === 37 ||
							e.keyCode === 38 ||
							e.keyCode === 39 ||
							e.keyCode === 40 ||
							e.keyCode === 8 ||
							e.keyCode === 46 ) {			
												

							
							if (e.keyCode === 8 || e.keyCode === 46) {
								currOri === 'across' ? nav.nextPrevNav(e, 37) : nav.nextPrevNav(e, 38); 
							} else {
								nav.nextPrevNav(e);
							}
							util.checkKeys();
							
							e.preventDefault();
							return false;
						} else {
							
							console.log('input keyup: '+solvedToggle);
							
							puzInit.checkAnswer(e);

						}

						if(util.checkAllSolved())
							alert("Congrats");
						
						util.checkKeys();

						e.preventDefault();
						return false;		
					});
			
					// tab navigation handler setup
					puzzEl.delegate('input', 'keydown', function(e) {

						if ( e.keyCode === 9) {
							
							mode = "setting ui";
							if (solvedToggle) solvedToggle = false;

							//puzInit.checkAnswer(e)

							nav.updateByEntry(e);
							
						} else {
							return true;
						}
												
						e.preventDefault();
									
					});
					
					// tab navigation handler setup
					puzzEl.delegate('input', 'click', function(e) {
						mode = "setting ui";
						if (solvedToggle) solvedToggle = false;

						console.log('input click: '+solvedToggle);
					
						nav.updateByEntry(e);
						e.preventDefault();
									
					});
					
					
					// click/tab clues 'navigation' handler setup
					clues.delegate('li', 'click', function(e) {
						mode = 'setting ui';
						
						if (!e.keyCode) {
							nav.updateByNav(e);
						} 
						e.preventDefault(); 
					});
					
					
					// highlight the letter in selected 'light' - better ux than making user highlight letter with second action
					puzzEl.delegate('#puzzle', 'click', function(e) {
						$(e.target).focus();
						$(e.target).select();
					});
					
					// DELETE FOR BG
					puzInit.calcCoords();
					
					// Puzzle clues added to DOM in calcCoords(), so now immediately put mouse focus on first clue
					clueLiEls = $('#puzzle-clues li');
					$('#' + currOri + ' li' ).eq(0).addClass('clues-active').focus();
				
					// DELETE FOR BG
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

						// while we're in here, add clues to DOM! - add only if clue is defined
						if(puzz.data[i].clue && i != puzz.data.length-2)
							$('#' + puzz.data[i].orientation).append('<li class="nonumber" tabindex="1" data-position="' + i + '">' + puzz.data[i].position + ". " + puzz.data[i].clue + '</li>'); 
						else if(puzz.data[i].clue)
							$('#' + puzz.data[i].orientation).append('<li style="margin-top: 6.4em;" class="nonumber" tabindex="1" data-position="' + i + '"><b>' + puzz.data[i].clue + '</b></li>'); 
						console.log(puzz.data.length);
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
					var light,
						$groupedLights,
						hasOffset = false,
						positionOffset = entryCount - puzz.data[puzz.data.length-1].position, // diff. between total ENTRIES and highest POSITIONS
						input;
						
					for (var x=1, p = entryCount; x <= p; ++x) {
						var letters = puzz.data[x-1].answer.split('');

						for (var i=0; i < entries[x-1].length; ++i) {
							light = $('[data-coords="' + entries[x-1][i] + '"]');
							
							// check if POSITION property of the entry on current go-round is same as previous. 
							// If so, it means there's an across & down entry for the position.
							// Therefore you need to subtract the offset when applying the entry class.
							if(x > 1 ){
								if (puzz.data[x-1].position === puzz.data[x-2].position) {
									hasOffset = true;
								};
							}
							
							// cell contains space
							if(letters[i] == ' ')
							{
								input = '<input class="crosswinput" maxlength="1" val="" type="text" tabindex="-1" disabled value=" "/>'
								$(light).addClass('space');
								//$(light).css( "width", "0" );
								//$(light).css( "heigth", "0" );
								$(light).css( "z-index", "10" );
								$(light).css( "border", "2px dotted black" );
							}
							else input = '<input class="crosswinput" maxlength="1" val="" type="text" tabindex="-1"/>';
							//console.log((hasOffset ? x - positionOffset : x));
							//console.log("Beseda:"+x+", crka "+letters[i]);
							
							if($(light).children().length === 0){
								$(light)
									.addClass('entry-' + (hasOffset ? x - positionOffset : x) + ' position-' + (x-1) )
									.append(input);
									// Put entry number in first 'light' of each entry, skipping it if already present
									if (i == 0) {
										//$(light).append('<span>' + puzz.data[x-1].position + '</span>');
									}
							}
							else {
								$(light)
									.addClass('entry-' + (hasOffset ? x - positionOffset : x) + ' position-' + (x-1) );
									console.log("is empty");
								if (i == 0) {
									//$(light).find("span").text($(light).find("span").text()+(', ' + puzz.data[x-1].position));
								}
							}
							
							for(var j=0, dat=puzz.chars; j < dat.length; j++)
							{
								//var charx = dat[j].splice('')[0];
								//var chary = dat[j].splice('')[1];
								
								if($(light).attr('data-coords') == dat[j])
								{
									$(light).append($("<span>" + (j+1) + "</span>").attr('char-index',j));
								}
							}
							
						};
						
						
						
						//console.log(letters);
						//console.log(entries);
						
					};	
					
					// unused chars
					$("td[class*='entry-7'] input").val(puzz.data[6].answer);
					$("td[class*='entry-7']").parent().css("display","none");
					$("td[class*='entry-7'] input").attr('disabled','disabled');
					
					util.highlightEntry();
					util.highlightClue();
					$('.active').eq(0).focus();
					$('.active').eq(0).select();
										
				},
				
				
				/*
					- Checks current entry input group value against answer
					- If not complete, auto-selects next input for user
				*/
				checkAnswer: function(e) {
					
					var valToCheck, currVal;
					
					util.getActivePositionFromClassGroup($(e.target));
				
					valToCheck = puzz.data[activePosition].answer.toLowerCase();
					
					currVal = $('.position-' + activePosition + ' input')
						.map(function() {
					  		return $(this)
								.val()
								.toLowerCase();
						})
						.get()
						.join('');
					
					
					
					//console.log(currVal + " " + valToCheck);
					if(valToCheck === currVal){	
						$('.active')
							.addClass('done')
							.removeClass('active');
					
						$('.clues-active').addClass('clue-done');
						if(solved.indexOf(valToCheck) == -1)
							solved.push(valToCheck);
						solvedToggle = true;
						return;
					}
					
					if(e.keyCode != 8)
						currOri === 'across' ? nav.nextPrevNav(e, 39) : nav.nextPrevNav(e, 40);
					
					//z++;
					//console.log(z);
					//console.log('checkAnswer() solvedToggle: '+solvedToggle);

				}				


			}; // end puzInit object
			

			var nav = {
				
				nextPrevNav: function(e, override) {

					var len = $actives.length,
						struck = override ? override : e.which,
						el = $(e.target),
						p = el.parent(),
						ps = el.parents(),
						selector;
				
					util.getActivePositionFromClassGroup(el);
					util.highlightEntry();
					util.highlightClue();
					
					$('.current').removeClass('current');
					
					selector = '.position-' + activePosition + ' input:not([disabled])';
					
					//console.log('nextPrevNav activePosition & struck: '+ activePosition + ' '+struck);
						
					// move input focus/select to 'next' input
					switch(struck) {
						case 39:
							p
								.nextAll()
								.find('input:not([disabled])')
								.first()
								.addClass('current')
								.select();
							
							break;
						
						case 37:
							p
								.prevAll()
								.find('input:not([disabled])')
								.last()
								.addClass('current')
								.select();

							break;

						case 40:
							ps
								.nextAll('tr')
								.find(selector)
								.first()
								.addClass('current')
								.select();

							break;

						case 38:
							ps
								.prevAll('tr')
								.find(selector)
								.last()
								.addClass('current')
								.select();

							break;

						default:
						break;
					}
															
				},
	
				updateByNav: function(e) {
					var target;
					
					$('.clues-active').removeClass('clues-active');
					$('.active').removeClass('active');
					$('.current').removeClass('current');
					currIndex = 0;

					target = e.target;
					activePosition = $(e.target).data('position');
					
					util.highlightEntry();
					util.highlightClue();
										
					$('.active').eq(0).focus();
					$('.active').eq(0).select();
					$('.active').eq(0).addClass('current');
					
					// store orientation for 'smart' auto-selecting next input
					currOri = $('.clues-active').parent('ol').prop('id');
										
					activeClueIndex = $(clueLiEls).index(e.target);
					//console.log('updateByNav() activeClueIndex: '+activeClueIndex);
					
				},
			
				// Sets activePosition var and adds active class to current entry
				updateByEntry: function(e, next) {
					var classes, next, clue, e1Ori, e2Ori, e1Cell, e2Cell;
					
					if(e.keyCode === 9 || next){
						// handle tabbing through problems, which keys off clues and requires different handling		
						activeClueIndex = activeClueIndex === clueLiEls.length-1 ? 0 : ++activeClueIndex;
					
						$('.clues-active').removeClass('.clues-active');
												
						next = $(clueLiEls[activeClueIndex]);
						currOri = next.parent().prop('id');
						activePosition = $(next).data('position');
												
						// skips over already-solved problems
						util.getSkips(activeClueIndex);
						activePosition = $(clueLiEls[activeClueIndex]).data('position');
						
																								
					} else {
						activeClueIndex = activeClueIndex === clueLiEls.length-1 ? 0 : ++activeClueIndex;
					
						util.getActivePositionFromClassGroup(e.target);
						
						clue = $('[data-position=' + activePosition + ']');
						activeClueIndex = $(clueLiEls).index(clue);
						
						currOri = clue.parent().prop('id');
						
					}
						
						util.highlightEntry();
						util.highlightClue();
						
						//$actives.eq(0).addClass('current');	
						//console.log('nav.updateByEntry() reports activePosition as: '+activePosition);	
				}
				
			}; // end nav object

			
			var util = {
				highlightEntry: function() {
					// this routine needs to be smarter because it doesn't need to fire every time, only
					// when activePosition changes
					$actives = $('.active');
					$actives.removeClass('active');
					$actives = $('.position-' + activePosition + ' input').addClass('active');
					$actives.eq(0).focus();
					$actives.eq(0).select();
				},
				
				highlightClue: function() {
					var clue;				
					$('.clues-active').removeClass('clues-active');
					$('[data-position=' + activePosition + ']').addClass('clues-active');
					
					if (mode === 'interacting') {
						clue = $('[data-position=' + activePosition + ']');
						activeClueIndex = $(clueLiEls).index(clue);
					};
				},
				
				getClasses: function(light, type) {
					if (!light.length) return false;
					
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

				getActivePositionFromClassGroup: function(el){

						classes = util.getClasses($(el).parent(), 'position');

						if(classes.length > 1){
							// get orientation for each reported position
							e1Ori = $('[data-position=' + classes[0].split('-')[1] + ']').parent().prop('id');
							e2Ori = $('[data-position=' + classes[1].split('-')[1] + ']').parent().prop('id');

							// test if clicked input is first in series. If so, and it intersects with
							// entry of opposite orientation, switch to select this one instead
							e1Cell = $('.position-' + classes[0].split('-')[1] + ' input').index(el);
							e2Cell = $('.position-' + classes[1].split('-')[1] + ' input').index(el);

							if(mode === "setting ui"){
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
						
						console.log('getActivePositionFromClassGroup activePosition: '+activePosition);
						
				},
				
				checkSolved: function(valToCheck) {
					for (var i=0, s=solved.length; i < s; i++) {
						if(valToCheck === solved[i]){
							return true;
						}

					}
				},
				checkAllSolved: function() {
					return solved.length === puzz.data.length ? true : false;
				},
				
				getSkips: function(position) {
					if ($(clueLiEls[position]).hasClass('clue-done') && !util.checkAllSolved()){
						activeClueIndex = position === clueLiEls.length-1 ? 0 : ++activeClueIndex;
						util.getSkips(activeClueIndex);
					} else {
						return false;
					}
				},
				// checks keys
				/*
					Remaps the key chars, for ex:
					
					1: w
					2: i
					3: n
				*/
				checkKeys: function() {
					var keys = $("[char-index]");
					
					for(m = 0;m < keys.length;m++){
						var newObj = [];
						var inputNode;
						var nodeList = keys[m].parentNode.childNodes
						
						for(var n=0;n<nodeList.length;n++){
							if(nodeList[n].nodeName == "INPUT"){
								formattedKeys[keys[m].getAttribute("char-index")] = nodeList[n].value;
							}
						}
					}
					console.log(formattedKeys);
					if(formattedKeys.join('') == puzz.answer.toLowerCase())
						$("#msg").text("You won. Congratulations!");
					
					util.printKeys();
					console.log(formattedKeys.join('')+"=="+puzz.answer.toLowerCase());
				},
				printKeys: function() {
					if(	activePosition!=5)
					{
						var key = formattedKeys.join('');
						$("#key p").text(key);
						
						$.each(formattedKeys, function(key,value){
							$(".entry-6 input").eq(key).val(value);
						});						
					}
				}
				
			}; // end util object

				
			puzInit.init();
	
							
	}
	
})(jQuery);