/*
* A javascript-enhanced crossword puzzle [c] Jesse Weisbeck, MIT/GPL 
*
* modified by Matej Jurko
*/



(function($) {
	$(function() {
		// 
		var puzzleData = {
			answer: "compose",
			chars: [
				"6,1",
				"2,3",
				"4,5",
				"3,7",
				"9,7",
				"8,9",
				"2,9"
			],
			words: [
				/*
					railway
					quiet
					detail
					easy match
					random campaign
					Key: compose
				*/
				// list words here
			 	{
					clue: "trecsmt",
					answer: "metrics",
					position: 1,
					orientation: "across",
					startx: 1,
					starty: 1
				},
				{
					clue: "mcpoexl",
					answer: "complex",
					position: 2,
					orientation: "across",
					startx: 1,
					starty: 3
				},
				{
					clue: "iamnal",
					answer: "animal",
					position: 3,
					orientation: "across",
					startx: 1,
					starty: 5
				},
				{
					clue: "epreta uaitnylconl",
					answer: "repeat continually",
					position: 4,
					orientation: "across",
					startx: 1,
					starty: 7
				},
				{
					clue: "pdarte rsewemoeh",
					answer: "depart somewhere",
					position: 5,
					orientation: "across",
					startx: 1,
					starty: 9
				},
				// key, which includes chars from words above
				// answer word here is just for visual, program compares entered keys to puzzleData.answer
				{
					clue: "Key:",
					answer: "compose",
					position: 6,
					orientation: "across",
					startx: 1,
					starty: 12
				},
				// if any char is not included in words above, then  char may already be printed out at game init
				// edit/add entries in function buildEntries
				{
					answer: "m",
					position: 7,
					orientation: "across",
					startx: 1,
					starty: 13
				}
			]
		};
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)
