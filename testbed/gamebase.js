function GameData (w, h) {
	this.width  = w;
	this.height = h;
	this.matrix = new Int8Array(w*h);

	this.reset = function () {
		for (var y = 0 ; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) this.setCell (x, y, 0);
		}
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
	
	this.setCell = function (x, y, val) {
		if (!this.cellIsValid(x, y)) return;
		this.matrix[y*this.width + x] = val;
	};

	this.generateProblem = function (theword) {
	};
	
	this.debugPrintProblem = function () {
		console.log("Game Matrix");
		for (var y = 0 ; y < this.height; y++) {
			var row = "R" + y + ": ";
			for (var x = 0; x < this.width; x++) {
				row += this.getCell(x, y) + " ";
			}
			console.log (row);
		}
	};
}