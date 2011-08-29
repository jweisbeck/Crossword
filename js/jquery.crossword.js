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
			puzz.probs = entryData;
			
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
				probs = puzz.probs.length,
				rows = [],
				cols = [],
				targetProblem,
				currVal,
				valToCheck,
				tabindex,
				arrowTarget;
					
				// first task is reorder the problems array numerically by position
				// Then listing clues in order is much easier
				puzz.probs.sort(function(a,b) {
					return a.position - b.position;
				});
				
				// Set keyup handlers for the 'entry' inputs that will be added presently
				puzzEl.delegate('input', 'keyup', function(e) {						
					
					// run check answer routine
					if ($(this).val() !== "") {
						// check current input against answerer. If true, disable inputs
						checkAnsw($(this).parent());
					}
					
					
					/*
						left, right, up and down keystrokes
					*/
					console.log(e.keyCode);
					switch(e.keyCode) {
						case 39:
							arrowTarget = $(this).parent().next().find('input');
							arrowTarget.select();
							break;
							
						case 37:
							arrowTarget = $(this).parent().prev().find('input');
							arrowTarget.select();							
							break;
							
						case 40:
							var targ;
							arrowTarget = $(this).parent().prop('class').split(' ');
							targ = $(this).parent().next('.entry-' + arrowTarget[0].split('-')[1]);
							$(targ).children('input').select;
							
							break;
						
						case 38:
						
							break;
						
						default:
						break;
					}
					
					/*
						// If at the last entry, tab cycles input focus back to first entry
						// There's a visual hitch that will be fixed later		
					*/
				/*
					if( tabindex === puzz.probs.length-1 && e.keyCode === 9) {	
						$('.entry-1 input:eq(0)').focus()
						$('.entry-1 input:eq(0)').select();
					} 
					tabindex = $(this).prop('tabindex');
					if(tabindex === 0 && $(this).val() === ""){
							$('.entry-1 input:eq(0)').focus()
							$('.entry-1 input:eq(0)').select();
					}
				*/
					return false;
				});
				
				// highlight the letter in selected 'light' - better ux
				puzzEl.delegate('input', 'click', function() {				
					this.focus();
					this.select();
				});
				
				
				/*
					Given beginning coordinates, calculate all coordinates for entries
				*/
				for (var i = 0, p = probs; i < p; ++i) {		
					// set up array of coordinates for each problem
					entries.push(i);
					entries[i] = [];

					for (var x=0, j = puzz.probs[i].answer.length; x < j; ++x) {
						entries[i].push(x);
						coords = puzz.probs[i].orientation === 'across' ? "" + puzz.probs[i].startx++ + "," + puzz.probs[i].starty + "" : "" + puzz.probs[i].startx + "," + puzz.probs[i].starty++ + "" ;
						entries[i][x] = coords; 
					}
					
					// while we're in here, add clues to DOM!
					$('#' + puzz.probs[i].orientation).append('<li>' + puzz.probs[i].position + ". " + puzz.probs[i].clue + '</li>'); 
				}				

				

				// Calculate rows/cols by finding max coords of problems
				for (var i = 0, p = probs; i < p; ++i) {
					for (var x=0; x < entries[i].length; x++) {
						cols.push(entries[i][x].split(',')[0]);
						rows.push(entries[i][x].split(',')[1]);
					};
				}

				rows = Math.max.apply(Math, rows) + "";
				cols = Math.max.apply(Math, cols) + "";
				
							
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
				
				
				/*
					Build entries into table
				*/
				var puzzCells = $('#puzzle td'),
					light,
					$groupedLights,
					tabindex;

				for (var x=0, p = probs; x < p; ++x) {
					for (var i=0; i < entries[x].length; ++i) {
						light = $(puzzCells +'[data-coords="' + entries[x][i] + '"]');
						if($(light).empty()){
							tabindex = 'tabindex="' + x+i +'"';
							//tabindex = i === 0 ? 'tabindex="' + x + '"' : '';
							$(light)
								.addClass('entry-' + (x+1))
								.append('<input maxlength="1" val="" type="text" ' + tabindex + ' />');
						}
					};
		
				};
				
				
				
				
				/*
					Do some work after entries are constructed
				*/
				
				// 1. Put entry number in first 'light' of each entry, skipping it if already present
				for (var i=1, p = probs; i <= p; ++i) {
					$groupedLights = $('.entry-' + i);
					if(!$('.entry-' + i +':eq(0) span').length){
						$groupedLights.eq(0).append('<span>' + puzz.probs[i-1].position + '</span>');
					}
				}	
				
				
				// 3. Run a check on keyup to see if answerer matches current value
				checkAnsw = function(cell) {
						var classes = $(cell).prop('class').split(' ');
							
						for (var i=0, c = classes.length; i < c; ++i) {
							targetProblem = classes[i].split('-')[1];
							valToCheck = puzz.probs[targetProblem-1].answer.toLowerCase();
							currVal = $('.entry-' + targetProblem + ' input').map(function() {
							  			return $(this).val().toLowerCase();
									  }).get().join('');

							if(valToCheck === currVal) {
								$('.entry-' + targetProblem)
									.addClass('done');
														
							}
						
							/*
							if(valToCheck !== currVal && i === 1){
								$('.entry-' + targetProblem).removeClass('done');	
							}
							*/

						
							// Need to flip tabindexes around so tabbing will move through intersecting inputs that might have tabindex of other entry
							//console.log(cell);
							//$(targetProblem).prop('tabindex', targetProblem);
						};
										
				};
							
	}
})(jQuery);