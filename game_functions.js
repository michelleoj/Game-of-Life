
module.exports = {

	getNextGen: function(live_cells, rows, cols) {
		var turnAliveList = [];
		var turnDeadList = [];
		
		//look at the live_cells and make them alive on board
		var allBlocks = makeBoard(rows, cols);
		setBlockState(live_cells, 'alive', allBlocks);

		
		

		//look in the live cells list and choose the cells that make it to the next
		//generation
		for (var i = 0; i < live_cells.length; i++) {
			var block = allBlocks[live_cells[i][0]][live_cells[i][1]];
			var numberAlive = countAliveNeighbors(block, rows, cols, allBlocks);
			console.log(numberAlive);
			if ((numberAlive == 2) || (numberAlive == 3)) {
				turnAliveList.push([block.getX(), block.getY()]);
			} else {
				turnDeadList.push([block.getX(), block.getY()]);
			}
		}

		//handles all the blocks that aren't in the alive list and sees
		//which ones go on to the next generation
		for (var i = 0; i < cols; i++) {
			for (var j = 0; j < rows; j++) {
				var block = allBlocks[i][j];
				if (live_cells.indexOf(block) == -1) {
					var count = countAliveNeighbors(block, rows, cols, allBlocks);
					if (count == 3) {
						turnAliveList.push([block.getX(), block.getY()]);
					} else {
						turnDeadList.push([block.getX(), block.getY()]);
					}
				}
			}
		}

		//update their states
		setBlockState(turnAliveList, 'alive', allBlocks);
		setBlockState(turnDeadList, 'dead', allBlocks);


		return turnAliveList.sort();
	}
}

//BLOCK CLASS
var Block = function(state, x, y) {
	var self = Object.create(Block.prototype);
	self.state = state; // string 'dead' or 'alive'
	self.x = x; // int xcoord
	self.y = y; //int ycoord

	//GETTERS & SETTERS

	self.getState = function() { return self.state; }

	self.setState = function(newState) { self.state = newState; }

	self.getX = function() { return self.x; }

	self.getY = function() { return self.y; }

	return self;
}



//GAME FUNCTIONS
function makeBoard(rows, cols) {
	var allBlocks = {}

	for (var i = 0; i < rows; i++) {
		allBlocks[String(i)] = {};
		for (var j = 0; j < cols; j++) {
			var block = Block('dead', i, j);
			allBlocks[String(i)][String(j)] = block;
		}
	}

	return allBlocks;
}

function setBlockState(cells, state, allBlocks) {
	for (cell in cells) {
		var x = cells[cell][0];
		var y = cells[cell][1];
		if (state == 'alive') {
			allBlocks[String(x)][String(y)].setState('alive');
		} else {
			allBlocks[String(x)][String(y)].setState('dead');
		}
	}
}

function countAliveNeighbors(block, rows, cols, allBlocks) {
	var counter = 0;
	for (var i = block.getX() - 1; i <= block.getX() + 1; i++) {
		for (var j = block.getY() - 1; j <= block.getY() + 1; j++) {
			if (((i >= 0) && (i < cols)) && ((j >= 0) && (j < rows)) && !((i == block.getX()) && (j == block.getY()))) {
				if (allBlocks[i][j].getState() === "alive") {
					counter++;
				}
			}
		}
	}
	return counter;
}
	