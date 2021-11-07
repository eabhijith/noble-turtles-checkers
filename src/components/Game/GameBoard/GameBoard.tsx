
import React, { Component, CSSProperties } from "react";
import './GameBoard.css';
import Row from './Row';
import Cell from './Cell';



interface GameBoardProps {
}

interface GameBoardState {
    board: any;
    activePlayer: string;
    aiDepthCutoff: number;
    count: number;
    popShown: boolean;
}
export default class GameBoard extends Component<GameBoardProps,GameBoardState> {
    public readonly state: GameBoardState = {
        board: [
            ['b','-','b','-','b','-','b','-'],
            ['-','b','-','b','-','b','-','b'],
            ['b','-','b','-','b','-','b','-'],
            ['-','-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-','-'],
            ['-','r','-','r','-','r','-','r'],
            ['r','-','r','-','r','-','r','-'],
            ['-','r','-','r','-','r','-','r']
        ],
        activePlayer: 'r',
        aiDepthCutoff: 3,
        count: 0,
        popShown: false
	};

    constructor(props: GameBoardProps) {
        super(props);
        this.handlePieceClick = this.handlePieceClick.bind(this);
        this.executeMove = this.executeMove.bind(this);
        this.reset = this.reset.bind(this);
    }
	public render(): JSX.Element {
		return (
            <div>
                <div className="notification is-success">
                <button className="delete"></button>
                        Congratulations 🎉 🎉 🎉 🎉!! <strong>player 1 has won!!</strong>
                </div>
			    <div className="nt-board-container">
				    <div className={'board '+this.state.activePlayer}>
					{
						this.state.board.map((row:number, index:number) => <Row rowArr={row} handlePieceClick={this.handlePieceClick} rowIndex={index}/>)
					}
				    </div>
			    </div>
            </div>
		);
	}
	public aboutPopOpen(): void {
		this.setState({popShown: true});
	}
	public aboutPopClose() : void  {
		this.setState({popShown: false});
	}

	public handlePieceClick(e:any) : void {
		let rowIndex = parseInt(e.target.attributes['data-row'].nodeValue),
		    colIndex = parseInt(e.target.attributes['data-col'].nodeValue);
		if (this.state.board[rowIndex][colIndex].indexOf(this.state.activePlayer) > -1) {
			//this is triggered if the piece that was clicked on is one of the player's own pieces, it activates it and highlights possible moves
			this.state.board = this.state.board.map(function(row:any){return row.map(function(cell:any){return cell.replace('a', '')});}); //un-activate any previously activated pieces
			this.state.board[rowIndex][colIndex] = 'a'+this.state.board[rowIndex][colIndex];
			this.highlightPossibleMoves(rowIndex, colIndex);
		}
		else if(this.state.board[rowIndex][colIndex].indexOf('h') > -1) {
			//this is activated if the piece clicked is a highlighted square, it moves the active piece to that spot.
			this.state.board = this.executeMove(rowIndex, colIndex, this.state.board, this.state.activePlayer);
			//is the game over? if not, swap active player
			this.setState(this.state);
			if (this.winDetection(this.state.board, this.state.activePlayer)) {
				alert(this.state.activePlayer+ ' won the game!');
			}
			else {
				this.state.activePlayer = (this.state.activePlayer == 'r' ? 'b' : 'r');
			}
		}
		this.setState(this.state);
	}
	public executeMove(rowIndex:any, cellIndex:any, board:any, activePlayer:any) :any {
		let activePiece:string = '';
		for (var i = 0; i < board.length; i++) {
			//for each row
			for (var j = 0; j < board[i].length; j++) {
				if (board[i][j].indexOf('a')>-1) {
					activePiece = board[i][j];
				}
			}
		}
		//make any jump deletions
		var deletions = board[rowIndex][cellIndex].match(/d\d\d/g);
		if (typeof deletions !== undefined && deletions !== null && deletions.length > 0) {
			for (var k = 0; k < deletions.length; k++) {
				var deleteCoords = deletions[k].replace('d', '').split('');
				board[deleteCoords[0]][deleteCoords[1]] = '-';
			}
		}
		//remove active piece from it's place
		board = board.map(function(row:any){return row.map(function(cell:any){return cell.replace(activePiece, '-')});});
		//unhighlight
		board = board.map(function(row:any){return row.map(function(cell:any){return cell.replace('h', '-').replace(/d\d\d/g, '').trim()});}); 
		//place active piece, now unactive, in it's new place
		board[rowIndex][cellIndex] = activePiece.replace('a', '');;
		if ( (activePlayer == 'b' && rowIndex == 7) || (activePlayer == 'r' && rowIndex == 0) ) {
			board[rowIndex][cellIndex]+= ' k';
		}		
		return board;
	}

	public highlightPossibleMoves(rowIndex:any, cellIndex:any) : any{
		//unhighlight any previously highlighted cells
        // this.state.setState()
		this.state.board = this.state.board.map(function(row:any){return row.map(function(cell:any){return cell.replace('h', '-').replace(/d\d\d/g, '').trim()});}); 

		let possibleMoves = this.findAllPossibleMoves(rowIndex, cellIndex, this.state.board, this.state.activePlayer);

		//actually highlight the possible moves on the board
		//the 'highlightTag' inserts the information in to a cell that specifies 
		for (var j = 0; j < possibleMoves.length; j++) {
			var buildHighlightTag = 'h ';
			for (var k = 0; k < possibleMoves[j].wouldDelete.length; k++) {
				buildHighlightTag += 'd'+String(possibleMoves[j].wouldDelete[k].targetRow) + String(possibleMoves[j].wouldDelete[k].targetCell)+' ';
			}
			this.state.board[possibleMoves[j].targetRow][possibleMoves[j].targetCell] = buildHighlightTag;
		}

		this.setState(this.state);
	}

	public findAllPossibleMoves(rowIndex:any, cellIndex:any, board:any, activePlayer:any) : any{
		var possibleMoves = [];
		var directionOfMotion = [];
		var leftOrRight = [1,-1];
		var isKing = board[rowIndex][cellIndex].indexOf('k') > -1;
		if (activePlayer === 'b') {
			directionOfMotion.push(1);
		}
		else {
			directionOfMotion.push(-1);
		}

		//if it's a king, we allow it to both go forward and backward, otherwise it can only move in it's color's normal direction
		//the move loop below runs through every direction of motion allowed, so if there are two it will hit them both
		if (isKing) {
			directionOfMotion.push(directionOfMotion[0]*-1);
		}

		//normal move detection happens here (ie. non jumps)
		//for each direction of motion allowed to the piece it loops (forward for normal pieces, both for kings)
		//inside of that loop, it checks in that direction of motion for both left and right (checkers move diagonally)
		//any moves found are pushed in to the possible moves array
		for (var j = 0; j < directionOfMotion.length; j++) {
			for (var i = 0; i < leftOrRight.length; i++) {			
				if (
					typeof board[rowIndex+directionOfMotion[j]] !== 'undefined' &&
					typeof board[rowIndex+directionOfMotion[j]][cellIndex + leftOrRight[i]] !== 'undefined' &&
					board[rowIndex+directionOfMotion[j]][cellIndex + leftOrRight[i]] == '-'
				){
					if (possibleMoves.map(function(move){return String(move.targetRow)+String(move.targetCell);}).indexOf(String(rowIndex+directionOfMotion[j])+String(cellIndex+leftOrRight[i])) < 0) {
						possibleMoves.push({targetRow: rowIndex+directionOfMotion[j], targetCell: cellIndex+leftOrRight[i], wouldDelete:[]});
					}
				}
			}
		}

		//get jumps
		var jumps = this.findAllJumps(rowIndex, cellIndex, board, directionOfMotion[0], [], [], isKing, activePlayer);
		
		//loop and push all jumps in to possibleMoves
		for (var i = 0; i < jumps.length; i++) {
			possibleMoves.push(jumps[i]);
		}
		return possibleMoves;
	}

	public findAllJumps(sourceRowIndex:any, sourceCellIndex:any, board:any, directionOfMotion:any, possibleJumps:any, wouldDelete:any, isKing:any, activePlayer:any) : any{
		//jump moves
		var thisIterationDidSomething = false;
		var directions = [directionOfMotion];
		var leftOrRight = [1, -1];
		if (isKing) {
			//if it's a king, we'll also look at moving backwards
			directions.push(directions[0]*-1);
		}
		//here we detect any jump possible moves
		//for each direction available to the piece (based on if it's a king or not) 
		//and for each diag (left or right) we look 2 diag spaces away to see if it's open and if we'd jump an enemy to get there.
		for (var k = 0; k < directions.length; k++) {
			for (var l = 0; l < leftOrRight.length; l++) {
				// leftOrRight[l];
				if (
					typeof board[sourceRowIndex+directions[k]] !== 'undefined' &&
					typeof board[sourceRowIndex+directions[k]][sourceCellIndex+leftOrRight[l]] !== 'undefined' &&
					typeof board[sourceRowIndex+(directions[k]*2)] !== 'undefined' &&
					typeof board[sourceRowIndex+(directions[k]*2)][sourceCellIndex+(leftOrRight[l]*2)] !== 'undefined' &&
					board[sourceRowIndex+directions[k]][sourceCellIndex+leftOrRight[l]].indexOf((activePlayer == 'r' ? 'b' : 'r')) > -1 &&
					board[sourceRowIndex+(directions[k]*2)][sourceCellIndex+(leftOrRight[l]*2)] == '-'
				){
					if (possibleJumps.map(function(move:any){return String(move.targetRow)+String(move.targetCell);}).indexOf(String(sourceRowIndex+(directions[k]*2))+String(sourceCellIndex+(leftOrRight[l]*2))) < 0) {
						//this eventual jump target did not already exist in the list
						var tempJumpObject = {
							targetRow: sourceRowIndex+(directions[k]*2),
							targetCell: sourceCellIndex+(leftOrRight[l]*2),
							wouldDelete:[
								{
									targetRow:sourceRowIndex+directions[k],
									targetCell:sourceCellIndex+leftOrRight[l]
								}
							]
						};
						for (var i = 0; i < wouldDelete.length; i++) {
							tempJumpObject.wouldDelete.push(wouldDelete[i]);
						}
						possibleJumps.push(tempJumpObject);
						thisIterationDidSomething = true;
					}
				}
			}
		}
		
		//if a jump was found, thisIterationDidSomething is set to true and this function calls itself again from that source point, this is how we recurse to find multi jumps
		if(thisIterationDidSomething) {
			for (let i = 0; i < possibleJumps.length; i++) {
				let coords = [possibleJumps[i].targetRow, possibleJumps[i].targetCell],
				    children = this.findAllJumps(coords[0], coords[1], board, directionOfMotion, possibleJumps, possibleJumps[i].wouldDelete, isKing, activePlayer);
				for (var j = 0; j < children.length; j++) {
					if (possibleJumps.indexOf(children[j]) < 0) {
						possibleJumps.push(children[j]);
					}
				}
			}
		}
		return possibleJumps;
	}

    public winDetection(board:any, activePlayer:any) : any{
		var enemyPlayer = (activePlayer == 'r' ? 'b' : 'r');
		var result = true;
		for (var i = 0; i < board.length; i++) {
			for (var j = 0; j < board[i].length; j++) {
				if (board[i][j].indexOf(enemyPlayer) > -1) {
					result = false;
				}
			}
		}
		return result;
	}

	public reset() : void {
		this.setState({
			board: [
				['b','-','b','-','b','-','b','-'],
				['-','b','-','b','-','b','-','b'],
				['b','-','b','-','b','-','b','-'],
				['-','-','-','-','-','-','-','-'],
				['-','-','-','-','-','-','-','-'],
				['-','r','-','r','-','r','-','r'],
				['r','-','r','-','r','-','r','-'],
				['-','r','-','r','-','r','-','r']
			],
			activePlayer: 'r'
		});
	}
	
	cloneBoard(board:any) : any{
        var output = [];
        for (var i = 0; i < board.length; i++) output.push(board[i].slice(0));
        return output;
    }
}