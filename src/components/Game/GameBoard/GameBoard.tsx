
import { Component} from "react";
import './GameBoard.css';
import Row from './Row';

//Game Board Props Interface
interface GameBoardProps {
	updateCurrentPlayer : any,
	player1 : string,
    player2: string
}
//Game Board State Interface
export interface GameBoardState {
    board: any;
    activePlayer: string;
    continueTurn: boolean;
	winnerDecission : boolean;
    // gameState : string;
}

export default class GameBoard extends Component<GameBoardProps,GameBoardState> {
    public readonly state: GameBoardState = {
        board: [
            ['b','-','b','-','b','-','b','-'],
            ['-','b','-','b','-','b','-','b'],
            ['b','-','b','-','b','-','b','-'],
            ['-','-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-','-'],
            ['-','w','-','w','-','w','-','w'],
            ['w','-','w','-','w','-','w','-'],
            ['-','w','-','w','-','w','-','w']
        ],
        activePlayer: 'w',
        continueTurn : false,
		winnerDecission : false,
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
				{this.state.winnerDecission ? 
                (<div className="notification is-success">
                <button className="delete"></button>
                        Congratulations 🎉 🎉 🎉 🎉!! <strong>{this.state.activePlayer === 'w' ? this.props.player1 : this.props.player2} has won!!</strong>
                </div>)
				:''}
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

    

	public handlePieceClick(e:any) : void {
		let rowIndex = parseInt(e.target.attributes['data-row'].nodeValue),
		    colIndex = parseInt(e.target.attributes['data-col'].nodeValue);
        
        // Game State Based Logic to be Implemented

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
				this.state.winnerDecission = true;
				// alert(this.state.activePlayer+ ' has won the game!');
			}
			else {
				this.state.activePlayer = (this.state.activePlayer == 'w' ? 'b' : 'w');
				this.props.updateCurrentPlayer(this.state);
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
		if ( (activePlayer == 'b' && rowIndex == 7) || (activePlayer == 'w' && rowIndex == 0) ) {
			board[rowIndex][cellIndex]+= ' k';
		}		
		return board;
	}

	public highlightPossibleMoves(rowIndex:any, cellIndex:any) : any{
		//unhighlight any previously highlighted cells
        // this.state.setState()
		this.state.board = this.state.board.map(function(row:any){return row.map(function(cell:any){return cell.replace('h', '-').replace(/d\d\d/g, '').trim()});}); 

		let possibleMoves = this.calculateAllPossibleMoves(rowIndex, cellIndex, this.state.board, this.state.activePlayer);

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

	public calculateAllPossibleMoves(rowIndex:any, cellIndex:any, board:any, activePlayer:any) : any{
		var availableMoves = [];
		var direction = [];
		var leftOrRight = [1,-1];
		var isKing = board[rowIndex][cellIndex].indexOf('k') > -1;
		if (activePlayer === 'b') {
			direction.push(1);
		}
		else {
			direction.push(-1);
		}

		// Allow Dual side Moments if the Piece is a king
		if (isKing) {
			direction.push(direction[0]*-1);
		}

		// Normal Moves 
		for (let j = 0; j < direction.length; j++) {
			for (let i = 0; i < leftOrRight.length; i++) {			
				if (
					typeof board[rowIndex+direction[j]] !== 'undefined' &&
					typeof board[rowIndex+direction[j]][cellIndex + leftOrRight[i]] !== 'undefined' &&
					board[rowIndex+direction[j]][cellIndex + leftOrRight[i]] == '-'
				){
					if (availableMoves.map(function(move){return String(move.targetRow)+String(move.targetCell);}).indexOf(String(rowIndex+direction[j])+String(cellIndex+leftOrRight[i])) < 0) {
						availableMoves.push({targetRow: rowIndex+direction[j], targetCell: cellIndex+leftOrRight[i], wouldDelete:[]});
					}
				}
			}
		}

		//Get Available Jumps
		var jumps = this.findAllOptions(rowIndex, cellIndex, board, direction[0], [], [], isKing, activePlayer);
		
		//loop and push all jumps in to possibleMoves
		for (var i = 0; i < jumps.length; i++) {
			availableMoves.push(jumps[i]);
		}
		return availableMoves;
	}

	public findAllOptions(sourceRowIndex:any, sourceCellIndex:any, board:any, directionOfMotion:any, possibleJumps:any, wouldDelete:any, isKing:any, activePlayer:any) : any{
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
					board[sourceRowIndex+directions[k]][sourceCellIndex+leftOrRight[l]].indexOf((activePlayer == 'w' ? 'b' : 'w')) > -1 &&
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
				    children = this.findAllOptions(coords[0], coords[1], board, directionOfMotion, possibleJumps, possibleJumps[i].wouldDelete, isKing, activePlayer);
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
		var enemyPlayer = (activePlayer == 'w' ? 'b' : 'w');
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

	/** 
     * Method name : reset()
     * Pre-Condtion : this?.state <> null
     * Post-Condtion : this.state.activePlayer = 'w' && board is reset to default
     **/
	public reset() : void {
		this.setState({
			board: [
				['b','-','b','-','b','-','b','-'],
				['-','b','-','b','-','b','-','b'],
				['b','-','b','-','b','-','b','-'],
				['-','-','-','-','-','-','-','-'],
				['-','-','-','-','-','-','-','-'],
				['-','w','-','w','-','w','-','w'],
				['w','-','w','-','w','-','w','-'],
				['-','w','-','w','-','w','-','w']
        	],
			activePlayer: 'w'
		});
	}
	
	cloneBoard(board:any) : any{
        var output = [];
        for (var i = 0; i < board.length; i++) output.push(board[i].slice(0));
        return output;
    }
}