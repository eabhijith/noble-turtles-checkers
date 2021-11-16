import { Component} from "react";
import 'bulma/css/bulma.min.css';


interface RulesProps {
  toggleRules?: any;
}

interface RulesState {
}

export default class Rules extends Component<RulesProps,RulesState> {
    constructor(props : RulesProps){
        super(props);  
        console.log(this.props);
    }

    public render(): JSX.Element {
        return(
        <div className={`modal is-active`}>
          <div className="modal-background" />
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Rules</p>
              <button
                onClick={this.props.toggleRules}
                className="delete"
                aria-label="close"
              />
            </header>
            <section className="modal-card-body">
              <p><strong> General Rules</strong></p>
              <p>Board is of 8*8 grid</p>
              <p>Two players game</p>
              <p>Each player has 12 coins </p>
              <p>One player1 gets red and player2 gets grey</p>
              <p>Player cannot move opponent coin</p>
              <p>Players have alternative turns</p>
              <p>Dark cells are used to play</p>


              <p><strong>Men Coin</strong></p>
              <p>Uncrowned men can move diagonally forward</p>
              <p>Uncrowned men can only move one step diagonally in a uncapture move</p>
              <p>Uncrowned men cannot move backward</p>
              <p>In order to capture opponent coin player has to move two place diagonally</p>
              <p>Multiple coins can be captured in a single turn</p>

              <p><strong>King Coin</strong></p>
              <p>King coin tag is achieved when coin reaches to farthest row</p>
              <p>King coin can move backward diagonally</p>
              <p>King coin can capture backward diagonally</p>
              <p>king coin can caputre multiple opponent coins in single turn</p>


              <p><strong><u>Winning Odds</u></strong></p>
              <p><strong>winning</strong></p>
              <p>If opponents have no coins left</p>
              <p>The opponent has no chance to move coins</p>
              <p><strong>Draw</strong></p>
              <p>Both players cannot move coins</p>
            </section>
            <footer className="modal-card-foot">
              <button onClick={this.props.toggleRules} className="button">
                Close
              </button>
            </footer>
          </div>
        </div>
        );
    }
}