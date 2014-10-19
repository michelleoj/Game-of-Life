
module.exports = {

	getNextGen: function(live_cells, rows, cols) {
		var turnAliveList = [];
		var turnDeadList = [];
		var alivelist = []
		console.log('live cells: ', live_cells, typeof live_cells)

		//if no cells return empty array
		if ((live_cells == undefined) || (live_cells.length == 0)) {
			return [];
		}

		//since test front end sends live_cells as an array of strings and not an array of arrays
		//reformat
		if (typeof live_cells == "object") {
			for (var cell in live_cells) {
				console.log('cell: ', live_cells[cell]);
				if (typeof live_cells[cell] == "string") {
					alivelist.push(live_cells[cell].split(','));
				} else {
					alivelist.push(live_cells[cell]);
				}
			}
		} else { // only one cell
			alivelist.push(live_cells.split(','));
		}
		
		
		//look at the live_cells and make them alive on board
		var allBlocks = makeBoard(rows, cols);
		setBlockState(alivelist, 'alive', allBlocks);

		console.log('alive list: ', alivelist);
		

		//look in the live cells list and choose the cells that make it to the next
		//generation
		for (var i = 0; i < alivelist.length; i++) {
			
			var block = allBlocks[String(alivelist[i][0])][String(alivelist[i][1])];
			console.log('sup', block);
			var numberAlive = countAliveNeighbors(block, rows, cols, allBlocks);
			console.log('num', numberAlive);
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

		
		return turnAliveList;
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
			// console.log('\n BLOCK: ', block, '\n');
			allBlocks[String(i)][String(j)] = block;
		}
	}

	// console.log('\n all blocks: ', allBlocks, '\n');
	return allBlocks;
}

function setBlockState(cells, state, allBlocks) {
	for (cell in cells) {
		var x = cells[cell][0];
		var y = cells[cell][1];
		
		console.log('x,y', x, y, cells[cell]);
		if (state == 'alive') {
			// console.log('\n block:', allBlocks[String(x)][String(y)], allBlocks[x][y], '\n');
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
	