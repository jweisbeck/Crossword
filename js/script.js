(function($) {
	$(function() {
		// provide crossword entries in an array of objects like the following example
		// Position refers to the numerical order of an entry. Each position can have 
		// two entries: an across entry and a down entry
		var puzzleData = [
			 	{
					clue: "Checked by a robot",
					answer: "scanned",
					position: 5,
					orientation: "down",
					startx: 5,
					starty: 1
				},
			 	{
					clue: "With Your Ears",
					answer: "sound",
					position: 3,
					orientation: "across",
					startx: 2,
					starty: 4
				},
				{
					clue: "Favorite Pet",
					answer: "hamster",
					position: 1,
					orientation: "down",
					startx: 2,
					starty: 1
				},
				{
					clue: "Least favorite pet",
					answer: "cat",
					position: 2,
					orientation: "across",
					startx: 1,
					starty: 2
				},
				{
					clue: "Gain knowledge",
					answer: "read",
					position: 4,
					orientation: "across",	
					startx: 2,
					starty: 7
				},
				{
					clue: "You can only wear one",
					answer: "Hats",
					position: 1,
					orientation: "across",
					startx: 2,
					starty: 1
				},
				{
					clue: "Supporting evidence",
					answer: "corroborate",
					position: 6,
					orientation: "across",
					startx: 5,
					starty: 2
				}
			] 
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)