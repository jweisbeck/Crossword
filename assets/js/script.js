// A javascript-enhanced crossword puzzle [c] Jesse Weisbeck, MIT/GPL 
(function($) {
	$(function() {
		// provide crossword entries in an array of objects like the following example
		// Position refers to the numerical order of an entry. Each position can have 
		// two entries: an across entry and a down entry
		var puzzleData = [
			{
				clue: "Arm joints",
				answer: "elbows",
				position: 1,
				orientation: "across",
				startx: 1,
				starty: 1
			},
			{
				clue: "Little angel",
				answer: "cherub",
				position: 4,
				orientation: "across",
				startx: 8,
				starty: 1
			},
			{
				clue: "One of the planets",
				answer: "pluto",
				position: 8,
				orientation: "across",
				startx: 1,
				starty: 3
			},
			{
				clue: "Cradle=song",
				answer: "lullaby",
				position: 9,
				orientation: "across",
				startx: 7,
				starty: 3
			},
			{
				clue: "Ask for",
				answer: "request",
				position: 10,
				orientation: "across",
				startx: 1,
				starty: 5
			},
			{
				clue: "Conductor's stick",
				answer: "baton",
				position: 11,
				orientation: "across",
				startx: 9,
				starty: 5
			},
			{
				clue: "Tired out",
				answer: "exhausted",
				position: 12,
				orientation: "across",
				startx: 3,
				starty: 7
			},
			{
				clue: "Become narrower",
				answer: "taper",
				position: 17,
				orientation: "across",
				startx: 1,
				starty: 9
			},
			{
				clue: "Beginners",
				answer: "novices",
				position: 19,
				orientation: "across",
				startx: 7,
				starty: 9
			},
			{
				clue: "Hungarian red pepper",
				answer: "paprika",
				position: 21,
				orientation: "across",
				startx: 1,
				starty: 11
			},
			{
				clue: "Reside",
				answer: "dwell",
				position: 22,
				orientation: "across",
				startx: 9,
				starty: 11
			},
			{
				clue: "Simpler",
				answer: "easier",
				position: 23,
				orientation: "across",
				startx: 1,
				starty: 13
			},
			{
				clue: "Kidnapper's demand",
				answer: "ransom",
				position: 24,
				orientation: "across",
				startx: 8,
				starty: 13
			},
			{
				clue: "Sell abroad",
				answer: "export",
				position: 1,
				orientation: "down",
				startx: 1,
				starty: 1
			},
			{
				clue: "Curt",
				answer: "brusque",
				position: 2,
				orientation: "down",
				startx: 3,
				starty: 1
			},
			{
				clue: "Entire",
				answer: "whole",
				position: 3,
				orientation: "down",
				startx: 5,
				starty: 1
			},
			{
				clue: "Food fish",
				answer: "halibut",
				position: 5,
				orientation: "down",
				startx: 9,
				starty: 1
			},
			{
				clue: "Cook in an oven",
				answer: "roast",
				position: 6,
				orientation: "down",
				startx: 11,
				starty: 1
			},
			{
				clue: "On the far side",
				answer: "beyond",
				position: 7,
				orientation: "down",
				startx: 13,
				starty: 1
			},
			{
				clue: "Balitic country",
				answer: "lithuania",
				position: 9,
				orientation: "down",
				startx: 7,
				starty: 3
			},
			{
				clue: "Brave woman",
				answer: "heroine",
				position: 13,
				orientation: "down",
				startx: 5,
				starty: 7
			},
			{
				clue: "Author of Dombey and Son",
				answer: "dickens",
				position: 14,
				orientation: "down",
				startx: 11,
				starty: 7
			},
			{
				clue: "Paper fastener",
				answer: "staple",
				position: 15,
				orientation: "down",
				startx: 1,
				starty: 8
			},
			{
				clue: "Refuge",
				answer: "asylum",
				position: 16,
				orientation: "down",
				startx: 13,
				starty: 8
			},
			{
				clue: "Famous diarist",
				answer: "pepys",
				position: 18,
				orientation: "down",
				startx: 3,
				starty: 9
			},
			{
				clue: "Russian liquor",
				answer: "vodka",
				position: 20,
				orientation: "down",
				startx: 9,
				starty: 9
			}

		]
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)
