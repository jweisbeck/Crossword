// A javascript-enhanced crossword puzzle [c] Jesse Weisbeck, MIT/GPL 
(function($) {
	$(function() {
		// provide crossword entries in an array of objects like the following example
		// Position refers to the numerical order of an entry. Each position can have 
		// two entries: an across entry and a down entry
		var puzzleData = [
			 	{
					clue: "Особенность стиля программирования, когда не знаем выполнится ли то или иное событие.",
					answer: "Асинхронность",
					position: 1,
					orientation: "across",
					startx: 1,
					starty: 1
				},
			 	{
					clue: "Музыкальный инструмент и разворачивающийся блок.",
					answer: "Аккордеон",
					position: 1,
					orientation: "down",
					startx: 1,
					starty: 1
				},
				{
					clue: "Таким может быть тортик, лук и архитектура приложения.",
					answer: "Трёхслойная",
					position: 2,
					orientation: "down",
					startx: 12,
					starty: 1
				},
				{
					clue: "Что хорошо делать в свою ветку и плохо в чужую?",
					answer: "Форспуш",
					position: 3,
					orientation: "across",
					startx: 4,
					starty: 3
				},
				{
					clue: "Особая область на странице, которую используют пользователи скринридеров как дополнительный способ навигации. Например, футер и хедер.",
					answer: "Ориентир",
					position: 4,
					orientation: "down",	
					startx: 5,
					starty: 3
				},
				{
					clue: "Ячейка на матрице, единица разрешения дисплея устройства.",
					answer: "Пиксель",
					position: 5,
					orientation: "down",
					startx: 14,
					starty: 4
				},
				{
					clue: "HTML — это язык чего?",
					answer: "Разметки",
					position: 6,
					orientation: "down",
					startx: 7,
					starty: 7
				},
				{
					clue: "Тип компилятора, любимый всеми фронтами.",
					answer: "Транспайлер",
					position: 7,
					orientation: "across",
					startx: 5,
					starty: 8
				},
				{
					clue: "Элемент, который нельзя вкладывать в самого себя.",
					answer: "Ссылка",
					position: 8,
					orientation: "down",
					startx: 9,
					starty: 8
				},
				{
					clue: "Выдуманное заболевание, для которого характерно чрезмерное использование множественных классов для оформления и для хранения информации.",
					answer: "Классянка",
					position: 9,
					orientation: "across",
					startx: 7,
					starty: 13
				},
			] 
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)
