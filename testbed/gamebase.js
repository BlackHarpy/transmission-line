export const TRANSFORM_NONE		= 0;
export const TRANSFORM_SWAPUP		= 1;
export const TRANSFORM_SWAPDOWN	= 2;
export const TRANSFORM_CHANGECASE	= 3;

export function GameData (w, h) {
// function GameData (w, h) {
	this.width  = w;
	this.height = h;
	this.matrix = new Int8Array(w*h);

	this.reset = function () {
		for (var y = 0 ; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) this.setCell (x, y, TRANSFORM_NONE);
		}
	};

	this.getCols = function () {
		return this.width;
	};
	
	this.getRows = function () {
		return this.height;
	};

	this.cellIsValid = function (x, y) {
		if (x < 0 || x >= this.width)  return false;
		if (y < 0 || x >= this.height) return false;
		return true;
	};
	
	this.getCell = function (x, y) {
		if (!this.cellIsValid(x, y)) return 0;
		return this.matrix[y*this.width + x];
	};

	this.changeCase = function (string, charNdx) {
		var charCode = string[charNdx];
		var copy = string;

		if (charCode >= 'A' && charCode <=  'Z') {
			copy = this.replaceStrChar (string, charNdx, 97 + string.charCodeAt(charNdx) - 65);
		} else if (charCode >= 'a' && charCode <=  'a') {
			copy = this.replaceStrChar (string, charNdx, 65 + string.charCodeAt(charNdx) - 97);
		}
		return copy;
	};

	this.getCellWithFriendlyName = function (x, y) {
		var cell = this.getCell(x, y);
		switch (cell) {
			case TRANSFORM_CHANGECASE:	return "C";
			case TRANSFORM_SWAPUP: 		return "^";
			case TRANSFORM_SWAPDOWN: 	return "v";
			case TRANSFORM_NONE: 		return "-";
		}
		return "?";
	};
	
	this.replaceStrChar = function (string, ndx, c) {
		var codes = Array.from(string);
		codes[ndx] = String.fromCharCode(c);
		return codes.join("");
	};

	this.setCell = function (x, y, val) {
		if (!this.cellIsValid(x, y)) return;
		this.matrix[y*this.width + x] = val;
	};

	this.getRandomElement = function (arr) {
		var ndx = parseInt(Math.random() * arr.length);
		var elem = arr[ndx];

		arr[ndx] = arr[arr.length - 1];
		arr.pop();
		return elem;
	};
	
	this.applyTransforms = function (inStr, step) {
		var input = inStr;
		console.log('entrada', inStr)

		if (input.length > this.height) {
			console.log ("Cannot put the input string through the transform column! Word is too long.");
			return input;
		}
		
		if (step < 0 || step >= this.width) {
			console.log ("Specified row is outside the limits of current matrix");
			return input;
		}

		for (var r = 0; r < this.height; r++) {
			var tform  = this.getCell (step, r);

			switch (tform) {
				case TRANSFORM_SWAPUP:
					var l2 = input.charCodeAt(r - 1);
					input = this. replaceStrChar (input, r - 1, input.charCodeAt (r));
					input = this. replaceStrChar (input, r, l2);
					break;

				case TRANSFORM_SWAPDOWN:
					var l2 = input.charCodeAt(r + 1);
					input = this. replaceStrChar (input, r + 1, input.charCodeAt (r));
					input = this. replaceStrChar (input, r, l2);
					break;
					
				case TRANSFORM_CHANGECASE:
					input = this.changeCase (input, r);
					console.log('changeCASE')
					break;
			}
		}
		console.log('hola te devuelvo esto', input)
		return input;
	};

	this.generateProblem = function (theword, transforms) {
		var availColumns = new Array ();
		var inputWord    = theword;
		
		this.reset();
		if (theword.length > this.height ) {
			console.log ("Not enough rows in our matrix for the requested word!");
			return;
		}

		if (transforms.length > this.width ) {
			console.log ("Not enough columns in our matrix for the requested number of transforms!");
			return;
		}
		
		// Since we want only one transform per column, it makes sense to have a "stack" of columns
		// to keep track of those we still can pick for the problem
		for (var i = 0; i < this.width; i++) availColumns.push (i);
	
		// Populate the matrix
		for (var i = 0; i < transforms.length; i++) {
			var rowRndBase  = 0;
			var rowRndLimit = this.height;
			var col			= this.getRandomElement (availColumns);
			var tform		= transforms[i];
			
			//Special case: Swaps. They cannot pick first or last row, depending on their type
			if (tform == TRANSFORM_SWAPUP) {
				rowRndBase = 1;
			}else if (tform == TRANSFORM_SWAPDOWN) {
				rowRndLimit = this.height - 1;
			}
			var row = parseInt(Math.random()*rowRndLimit) + rowRndBase;
			this.setCell (col, row, tform);
		}
		
		// Put the string through the process from the last step to the first
		var inputWord = theword;
		for (var i = this.width-1; i >= 0; i--) {
			inputWord = this.applyTransforms (inputWord, i);
		}
		return inputWord;
	};

	this.debugPrintProblem = function () {
		console.log("Game Matrix");
		for (var y = 0 ; y < this.height; y++) {
			var row = "R" + y + ": ";
			for (var x = 0; x < this.width; x++) {
				row += this.getCellWithFriendlyName(x, y) + " ";
			}
			console.log (row);
		}
	};
}