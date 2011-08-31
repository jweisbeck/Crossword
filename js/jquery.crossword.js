/**
* Jesse Weisbeck's Crossword Puzzle (for all 3 people left who want to play them)
*
*/
(function($){
	$.fn.crossword = function(entryData) {
			/*
				Qurossword Puzzle: a javascript + jQuery crossword puzzle
				NOTES: 
				- This puzzle isn't designed to securely hide answerers. A user can see answerers in the js source
					- An xhr provision can be added later to hit an endpoint on keyup to check the answerer
				- The ordering of the array of problems doesn't matter. The position & orientation properties is enough information
				- Puzzle authors must provide a starting x,y coordinates for each entry
				- Entry orientation must be provided in lieu of provided ending x,y coordinates
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
				cluesAcross = $('#across'),
				cluesDown = $('#down'),
				entries = [], 
				coords,
				entryCount = puzz.data.length,
				rows = [],
				cols = [],
				targetProblem,
				currVal,
				valToCheck,
				tabindex,
				arrowTarget,
				inputTmp,
				currentEntry = '1';
		
			
			
			var puzInit = {
				
				init: function() {
					// first task is reorder the problems array numerically by position
					// Then listing clues in order is much easier
					puzz.data.sort(function(a,b) {
						return a.position - b.position;
					});


					// Set keyup handlers for the 'entry' inputs that will be added presently
					puzzEl.delegate('#puzzle', 'keyup', function(e) {
						if (e.keyCode === 9) {
							return false;
						};
						var selEl = $(e.target);						
						var parentEl = selEl.parent();

						// run check answer routine
						if (selEl.val() !== "") {
							puzInit.checkAnswer(parentEl);
						}

						// TODO this routine highlights lights of current problem
						/*
						var currentInput = $(parentEl).prop('class').split(' ')[0];
						if(currentInput !== inputTmp) {
							$(currentInput + ' input').css('backgroundColor', '#fff');
						} else {
							$('.' + currentInput + ' input').css('backgroundColor', '#bbb');

						}
						inputTmp = currentInput;
						*/
						
						pNav.arrowNav(e);
						
						return false;
					});

					// tab navigation handler setup
					$('body').delegate('li, input', 'keydown', function(e) {
						if (e.keyCode === 9) {
							// tab strike - highjack current focus and put it on clue entries
							pNav.tabNav(e);
						}
						
					});


					// highlight the letter in selected 'light' - better ux
					puzzEl.delegate('#puzzle', 'click', function(e) {
						$(e.target).focus();
						$(e.target).select();
					});
					
					puzInit.calcCoords();
					puzInit.buildTable();
					puzInit.buildEntries();
										
				},
				
				calcCoords: function() {
					/*
						Given beginning coordinates, calculate all coordinates for entries
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
						$('#' + puzz.data[i].orientation).append('<li tabindex="' + puzz.data[i].position  + '">' + puzz.data[i].position + ". " + puzz.data[i].clue + '</li>'); 
					}				
					
					// immediately put mouse focus on first clue
					$('#puzzle-clues li')
						.eq(0)
						.focus();


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
				
				buildTable: function() {
					/*
						Build the table markup
					*/	
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
				
				buildEntries: function() {
					/*
						Build entries into table
					*/
					var puzzCells = $('#puzzle td'),
						light,
						$groupedLights,
						tabindex;

					for (var x=0, p = entryCount; x < p; ++x) {
						for (var i=0; i < entries[x].length; ++i) {
							light = $(puzzCells +'[data-coords="' + entries[x][i] + '"]');
							if($(light).empty()){
								//tabindex = 'tabindex="' + x+i +'"';
								//tabindex = i === 0 ? 'tabindex="' + x + '"' : '';
								$(light)
									.addClass('entry-' + (x+1))
									.append('<input maxlength="1" val="" type="text" ' + tabindex + ' />');
							}
						};

					};	
					
					// Put entry number in first 'light' of each entry, skipping it if already present
					for (var i=1, p = entryCount; i <= p; ++i) {
						$groupedLights = $('.entry-' + i);
						if(!$('.entry-' + i +':eq(0) span').length){
							$groupedLights.eq(0)
								.append('<span>' + puzz.data[i-1].position + '</span>');
						}
					}	
										
				},
				
				checkAnswer: function(light) {
					var classes = util.classSplit(light);
					if(!classes){
						return;
					}
					for (var i=0, c = classes.length; i < c; ++i) {
						targetProblem = classes[i].split('-')[1];
						valToCheck = puzz.data[targetProblem-1].answer.toLowerCase();
						
						currVal = $('.entry-' + targetProblem + ' input').map(function() {
						  			return $(this).val().toLowerCase();
								  }).get().join('');

						if(valToCheck === currVal){
							for (var x=0; x < entries[targetProblem-1].length; ++x) {
								$('td[data-coords="' + entries[targetProblem-1][x] + '"]')
									.addClass('done')
									.children('input')
									.prop('disabled', true);
								
							};
						}

						/*
						if(valToCheck === currVal) {
							$('.entry-' + targetProblem)
								.addClass('done');
							$(light).addClass('done');							
						}
						*/
					
							
						if(valToCheck !== currVal){
							//$('.entry-' + targetProblem).removeClass('done');	
						}
						

					};
				}
								
			
			} // end p object
			

			var pNav = {
				
				cycleTabToBeginning: function() {
					/*
						// If at the last entry, tab cycles input focus back to first entry	
					*/
					var currentInput = selEl.parent().prop('class').split(' ')[0];
					var firstInSeries = $('.' + currentInput + ' input:eq(0)');
					
					tabindex = selEl.prop('tabindex');
					console.log(selEl.keyCode);
					if(  selEl.keyCode === 9 ) {	
						var tb = tabindex === entryCount ? 1 : tabindex+1;
						

						var l = $('.entry-' + tb + ':eq(0) input');

						if(l.hasClass('done')) {
							 l = $('.entry-' + tb+1 + ':eq(0) input');
						}
						
						l.focus()
						l.select();
					}
				},
				
					
				findCurrentEntry: function(target, dir) {
					
					var lightOffset = 0,
						arrowTarget = target,
						currTdEl,
						tmp;
						
					
					if(arrowTarget.length == 1){
						// there's only one class on the target, so we can deduce where the next neighbor is straightaway
						return $(this).parents().next('tr').find(' td.entry-' + arrowTarget[0].split('-')[1] + ' input');								
					} else {
						// it's an intersection 'light', so find previous/next light with only one class
							
						for (var i=0; i < arrowTarget.length; ++i) {
							tmp = $(this).parents().prev('tr').find('td.entry-' + arrowTarget[i]);
							tmp.prop('class').split(' ');
							
							if (tmp.length > 1){
								findCurrentEntry(arrowTarget);
							} else if(tmp.length == 1){
								return $(this).parents().next('tr').find(' td.entry-' + arrowTarget[i]);
							} else if(!tmp){
								// Oops! No previous lights. We need to move forward instead
								prev = $(this).parents().next('tr').find(' td.entry-' + arrowTarget[i]);
							
							}
						}
					}
					
				},
				
				arrowNav: function(e) {	
					var el = $(e.target);
					/*
						left, right, up and down keystrokes
					*/
					switch(e.which) {
						case 39:
							// left arrow
							arrowTarget = 	el.parent().next().find('input');
							arrowTarget.select();
							break;

						case 37:
							// right arrow
							arrowTarget = el.parent().prev().find('input');
							arrowTarget.select();							
							break;

						case 40:
							// down arrow
							
							arrowTarget = util.classSplit($(e.target).parent().prop('class'));

							targ = el.parents().next('tr').find(' td.entry-' + prev + ' input');																
							targ.focus()
							targ.select();
							break;

						case 38:
							// up arrow

							break;

						default:
						break;
					}
				},
				
				tabNav: function(e) {
					var elTabIndex = $(e.target).prop('tabindex');

					console.log(currentEntry +' '+ entryCount);
					if (currentEntry+1 === entryCount) {
								$('#puzzle-clues li')
									.eq(0)
									.focus();
							currentEntry = 1;		
					
					}
					++currentEntry;
					
						
				}
				
								
			} // end pNav object

			puzInit.init();
			

			var util = {
				classSplit: function(td) {
					// takes a <td> cell as input, splits the classes returns them as an array
					return td.prop('class').split(' ');
				},
				
				classCount: function(td	) {
					// takes a <td> cell as input, splits the classes returns the count
					return td.prop('class').split(' ').length;					
				}
				
				
			}

				
	
							
	}
})(jQuery);