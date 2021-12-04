import { Component, CSSProperties } from "react";
import 'bulma/css/bulma.min.css';
import GameBoard,{GameBoardState} from './GameBoard/GameBoard';


interface GameProps {
    toggleToPlay?: boolean;
    player1 : string,
    player2: string,
    playWithBot : boolean
}

interface GameState {
    currentPlayer : string
}

export default class Game extends Component<GameProps,GameState> {

    constructor(props : GameProps){
        super(props);  
        this.updateCurrentPlayer = this.updateCurrentPlayer.bind(this);
    }

    //Define State on Home Page
    public readonly state: GameState = {
        currentPlayer : this.props.player1
	}

    public updateCurrentPlayer(gameBoardState : GameBoardState) : void {
        let currentPlayer = gameBoardState.activePlayer === 'w' ? this.props.player1 : this.props.player2;
        this.setState({currentPlayer});
    }


    public render(): JSX.Element {

        const ntblk: CSSProperties = {
            color: 'rgba(255, 255, 255, 0.2)'
        };
        const ntwhite: CSSProperties = {
            color: '#D9D9D9'

        };
        let boardStyle : CSSProperties = {
            maxWidth: '600px',
            maxHeight: '600px'
        }

        return (
            <div className="tile is-ancestor">
                <div className="tile is-parent">
                    <article className="tile is-child box notification is-warning">
                        <p className="title">{this.state.currentPlayer}'s Turn</p>
                        <p className="subtitle">please click on the Piece to View your options</p>
                        <div className="content">
                        {/* <!-- Section to Include Timer--> */}
                            <p></p>
                        {/* <!-- Section to Include Timer : End--> */}
                            {/* <div className="buttons">
                                <button className="button is-primary is-light">Reset</button>
                            </div> */}
                        </div>
                    </article>
                </div>
                <div className="tile is-parent is-10">
                    <article className="tile is-child notification">
                        <GameBoard player1={this.props.player1} player2={this.props.player2} playWithBot={this.props.playWithBot} updateCurrentPlayer={this.updateCurrentPlayer}/>
                    </article>
                </div>
  
            </div>
        );
    }
}
