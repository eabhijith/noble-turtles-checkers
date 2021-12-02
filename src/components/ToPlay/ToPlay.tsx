//Import of required modules
import { Component} from "react";
import 'bulma/css/bulma.min.css';


//To Play Props Interface
interface ToPlayProps {
  toggleToPlay?: any;
  navigateToGame? : any;
}
//To Play State Interface
export interface ToPlayState {
  firstPlayer : string;
  secondPlayer : string;
}

export default class ToPlay extends Component<ToPlayProps,ToPlayState> {

    // Constuctor Implementation
    constructor(props : ToPlayProps){
        super(props);  
        this.handlePlayer2Change = this.handlePlayer2Change.bind(this);
        this.handlePlayer1Change = this.handlePlayer1Change.bind(this);
    }


    //Define State on To Play Page
    public readonly state: ToPlayState = {
        firstPlayer : 'Player 1',
        secondPlayer : 'Player 2'
	  }

    /** 
     * Method name : handlePlayer2Change()
     * Pre-Condtion : event <> null && event.target.value <> ''
     * Post-Condtion : this.state.secondPlayer = event.target.value
     **/
    private handlePlayer2Change(event:any) : void {
      this.setState({secondPlayer: event.target.value});
    }

    /** 
     * Method name : handlePlayer1Change()
     * Pre-Condtion : event <> null && event.target.value <> ''
     * Post-Condtion : this.state.firstPlayer = event.target.value
     **/
    private handlePlayer1Change(event:any) : void {
      this.setState({firstPlayer: event.target.value});
    }

    /** 
     * Method name : render()
     * Pre-Condtion : None
     * Post-Condtion : document.getElementByClassName('className') <> null
     **/
    public render(): JSX.Element {
        return (
        <div className={`modal is-active`}>
          <div className="modal-background" />
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Player Details</p>
              <button
                onClick={this.props.toggleToPlay}
                className="delete"
                aria-label="close"
              />
            </header>
            <section className="modal-card-body">
                <div className="columns">
                    <div className="column">
                        <div className="field">
                        <label className="label">First Player</label>
                        <div className="control">
                        <input
                        className="input"
                        type="text"
                        value={this.state.firstPlayer}
                        onChange={this.handlePlayer1Change}
                        />
                        
                        </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                        <label className="label">Second Player</label>
                        <div className="control">
                        <input
                        className="input"
                        type="text"
                        value={this.state.secondPlayer}
                        onChange={this.handlePlayer2Change}
                        />
                        <input id="switchColorSuccess" type="checkbox" name="switchColorSuccess" className="switch is-rounded" />
                        <label >Play with Bot</label>
                        </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="modal-card-foot">
              <button onClick={this.props.toggleToPlay} className="button">
                Cancel
              </button>
              <button  onClick={() => this.props.navigateToGame(this.state)} className="button is-primary is-medium">
                Start Playing 😀
              </button>
            </footer>
          </div>
        </div>
        );
    }
}
