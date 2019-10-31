// A javascript-enhanced crossword puzzle [c] Jesse Weisbeck, MIT/GPL 
(function($) {
	$(function() {
		// provide crossword entries in an array of objects like the following example
		// Position refers to the numerical order of an entry. Each position can have 
		// two entries: an across entry and a down entry
		var puzzleData = [
			{
				clue: "Gas man in RAF no longer a scholar (5)",
				answer: "efeoo",
				position: 1,
				orientation: "across",
				startx: 1,
				starty: 1
			},
			{
				clue: "Difficult to handle oak tree blocking entrance to packed motorway (7)",
				answer: "roehfes",
				position: 6,
				orientation: "across",
				startx: 7,
				starty: 1
			},
			{
				clue: "Tea makers belonging to female employers (8)",
				answer: "infusers",
				position: 12,
				orientation: "across",
				startx: 2,
				starty: 2
			},
			{
				clue: "English newspaper in France is most convenient for some (6)",
				answer: "eftest",
				position: 13,
				orientation: "across",
				startx: 1,
				starty: 3
			},
			{
				clue: "Scots scoured cranes from the east lacking compliance (7)",
				answer: "skirred",
				position: 14,
				orientation: "across",
				startx: 7,
				starty: 3
			},
			{
				clue: "A jumper necessary in Finland (4)",
				answer: "euro",
				position: 15,
				orientation: "across",
				startx: 1,
				starty: 4
			},
			{
				clue: "Soldiers Chinese people led astray retreat (8)",
				answer: "rehandle",
				position: 16,
				orientation: "across",
				startx: 6,
				starty: 4
			},
			{
				clue: "Artist wearing old Nancy's black backed stole (7)",
				answer: "orarion",
				position: 17,
				orientation: "across",
				startx: 1,
				starty: 5
			},
			{
				clue: "Good smoke for old Paddy (5)",
				answer: "ooeeo",
				position: 19,
				orientation: "across",
				startx: 9,
				starty: 5
			},
			{
				clue: "War heroes left unlimited in strength (6, 2 words)",
				answer: "thefew",
				position: 21,
				orientation: "across",
				startx: 5,
				starty: 6
			},
			{
				clue: "Gracious holy man in command of the occult (6)",
				answer: "mystic",
				position: 22,
				orientation: "across",
				startx: 1,
				starty: 7
			},
			{
				clue: "Inattentive like sheltered page (6)",
				answer: "asleep",
				position: 24,
				orientation: "across",
				startx: 8,
				starty: 7
			},
			{
				clue: "Sensational chant without backing (6)",
				answer: "eeffel",
				position: 30,
				orientation: "across",
				startx: 4,
				starty: 8
			},
			{
				clue: "Sail back to a line of warschips (5)",
				answer: "htotf",
				position: 33,
				orientation: "across",
				startx: 1,
				starty: 9
			},
			{
				clue: "Cheat Chinese bitch maybe turning tail (7)",
				answer: "sharpie",
				position: 34,
				orientation: "across",
				startx: 7,
				starty: 9
			},
			{
				clue: "Once more enliven East London men overcome by back end of race (8)",
				answer: "rearouse",
				position: 36,
				orientation: "across",
				startx: 1,
				starty: 10
			},
			{
				clue: "Fighter with outstanding boldness (4)",
				answer: "face",
				position: 37,
				orientation: "across",
				startx: 10,
				starty: 10
			},
			{
				clue: "King that's returning to entrance a Surrey community (7)",
				answer: "oerotke",
				position: 38,
				orientation: "across",
				startx: 1,
				starty: 11
			},
			{
				clue: "Captain Cooker perhaps to support the Queen (6)",
				answer: "rooter",
				position: 39,
				orientation: "across",
				startx: 8,
				starty: 11
			},
			{
				clue: "Hospital doctor wrongly tries to restrict Dutch nurse (8)",
				answer: "oecrmehk",
				position: 40,
				orientation: "across",
				startx: 5,
				starty: 12
			},
			{
				clue: "Slender earthy daughter out of control (7)",
				answer: "thready",
				position: 41,
				orientation: "across",
				startx: 1,
				starty: 13
			},
			{
				clue: "Russian girl out of Norway beginning to sow nutritious plants (5)",
				answer: "soyas",
				position: 42,
				orientation: "across",
				startx: 9,
				starty: 13
			},
			{
				clue: "Dishonest rector in Glasgow peeped outside (7)",
				answer: "eoeeoem",
				position: 1,
				orientation: "down",
				startx: 1,
				starty: 1
			},
			{
				clue: "Batting companion almost skied seven catches (7)",
				answer: "entraps",
				position: 2,
				orientation: "down",
				startx: 3,
				starty: 1
			},
			{
				clue: "Ordinary girl with a bad girl's name (6)",
				answer: "ofeort",
				position: 3,
				orientation: "down",
				startx: 4,
				starty: 1
			},
			{
				clue: "Outsiders expel the other one (7)",
				answer: "oustiti",
				position: 4,
				orientation: "down",
				startx: 5,
				starty: 1
			},
			{
				clue: "Virtuoso lacks unending mad enthusiasm (5)",
				answer: "estro",
				position: 5,
				orientation: "down",
				startx: 6,
				starty: 1
			},
			{
				clue: "Ceremonial day in once regal surroundings (6)",
				answer: "orkhtf",
				position: 7,
				orientation: "down",
				startx: 8,
				starty: 1
			},
			{
				clue: "Bird dated before November stopping mournful cry (7, 2 words)",
				answer: "hornowl",
				position: 8,
				orientation: "down",
				startx: 10,
				starty: 1
			},
			{
				clue: "Third stomach once a fourth part (6)",
				answer: "fardel",
				position: 9,
				orientation: "down",
				startx: 11,
				starty: 1
			},
			{
				clue: "Made small apertures in electronic box turned over in eastern yard (8)",
				answer: "eyeleted",
				position: 10,
				orientation: "down",
				startx: 12,
				starty: 1
			},
			{
				clue: "Team working with a flank facing forwards (6)",
				answer: "sideon",
				position: 11,
				orientation: "down",
				startx: 13,
				starty: 1
			},
			{
				clue: "Mostly finest exotic buffets can be delivered by us (5)",
				answer: "neifs",
				position: 18,
				orientation: "down",
				startx: 7,
				starty: 5
			},
			{
				clue: "They bite - I heard half of them eating odd bits of these (8)",
				answer: "eyeteeth",
				position: 20,
				orientation: "down",
				startx: 2,
				starty: 6
			},
			{
				clue: "Dotterel left out refurbished vacuum tube (7)",
				answer: "tetrode",
				position: 23,
				orientation: "down",
				startx: 4,
				starty: 7
			},
			{
				clue: "Tacks made so small (7)",
				answer: "slaloms",
				position: 25,
				orientation: "down",
				startx: 9,
				starty: 7
			},
			{
				clue: "Emotional bonding lifted us at the right time before hard year (7)",
				answer: "empathy",
				position: 26,
				orientation: "down",
				startx: 11,
				starty: 7
			},
			{
				clue: "Tom's taken in by father's aged companions (7)",
				answer: "pheeres",
				position: 27,
				orientation: "down",
				startx: 13,
				starty: 7
			},
			{
				clue: "Bellow possessing the ultimate in rough voice (6)",
				answer: "throat",
				position: 28,
				orientation: "down",
				startx: 1,
				starty: 8
			},
			{
				clue: "Skylark perhaps rose fluttering across a river (6)",
				answer: "soarer",
				position: 29,
				orientation: "down",
				startx: 3,
				starty: 8
			},
			{
				clue: "Third book penned by Defender of the Faith succeeded by chance (6)",
				answer: "fluked",
				position: 31,
				orientation: "down",
				startx: 6,
				starty: 8
			},
			{
				clue: "Metal grating in Wick across back of tunnel (6)",
				answer: "crfoeo",
				position: 32,
				orientation: "down",
				startx: 10,
				starty: 8
			},
			{
				clue: "Scots destroy a poet's praise (5)",
				answer: "herry",
				position: 35,
				orientation: "down",
				startx: 8,
				starty: 9
			}

		]

		$('#puzzle-wrapper').crossword(puzzleData);

	})

})(jQuery)