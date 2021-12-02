//Import of required modules
import { Component} from "react";
import 'bulma/css/bulma.min.css';
import { Button } from 'react-bulma-components';
import Rules from "../Rules/Rules";
import ToPlay from "../ToPlay/ToPlay";
import Game from "../Game/Game";
import {ToPlayState} from '../ToPlay/ToPlay'
// import app from '../../configs/firebase'

//Home Props Interface
interface HomeProps {}

//Home State Interface
interface HomeState {
    displayRules : boolean,
    displayToplay: boolean,
    startGame : boolean,
    player1 : string,
    player2: string
}

/** 
 * Home Page Component To Navigate between Options
 * **/
export default class Home extends Component<HomeProps,HomeState> {

    //Constructor for Home Page
    constructor(props : HomeProps) {
        super(props);
        this.toggleRules = this.toggleRules.bind(this);
        this.toggleToPlay = this.toggleToPlay.bind(this);
        this.navigateToGame = this.navigateToGame.bind(this);
    }

    //Define State on Home Page
    public readonly state: HomeState = {
        displayRules : false,
        displayToplay: false,
        startGame : false,
        player1 : 'Player 1',
        player2 : 'Player 2'
	}

    /** 
     * Method name : toggleRules()
     * Pre-Condtion : this?.state <> null && typeof(this.state.displayRules) == Boolean
     * Post-Condtion : this.state.displayRules = !this.state.displayRules
     **/
    public toggleRules = () => {
        this.setState({ displayRules: !this.state.displayRules });
    }

    /** 
     * Method name : toggleToPlay()
     * Pre-Condtion : this?.state <> null && typeof(this.state.displayToplay) == Boolean
     * Post-Condtion : this.state.displayToplay = !this.state.displayToplay
     **/
    public toggleToPlay = () => {
        this.setState({ displayToplay: !this.state.displayToplay });
    }

    /** 
     * Method name : navigateToGame()
     * Pre-Condtion : this?.state <> null && typeof(this.state.navigateToGame) == Boolean &&  typeof(this.state.startGame) == Boolean
     * Post-Condtion : this.state.navigateToGame = !this.state.navigateToGame && this.state.startGame = !this.state.startGame
     **/
    public navigateToGame = (state:ToPlayState) => {
        debugger;
        let player1  = state.firstPlayer,
            player2 = state.secondPlayer,
            displayToplay = !this.state.displayToplay,
            startGame = !this.state.startGame;
        this.setState({player1,player2,displayToplay,startGame});
        // this.setState({ displayToplay: !this.state.displayToplay });
        // this.setState({ startGame: !this.state.startGame });
    }

    /** 
     * Method name : render()
     * Pre-Condtion : None
     * Post-Condtion : document.getElementByClassName('className') <> null
     **/
    public render(): JSX.Element {
        return (
            <div className="box">
            <div className="block">
                <p className="title is-1 is-spaced ">Hey There Welcome to <strong>American Checkers!!</strong>.</p>
            </div>

            <div className="buttons">
                {this.state.startGame ? 
                '': 
                (<Button className="button is-primary is-medium is-fullwidth" onClick={this.toggleToPlay}  id="homepage-start-button">To Start Playing..</Button>)
                }
                
                <Button className="button is-primary is-info is-fullwidth" onClick={this.toggleRules} id="homepage-start-button">Rules</Button>
            </div>
            change...
            {this.state.displayRules ? ((<Rules toggleRules={this.toggleRules}></Rules>)) : ''}
            {this.state.displayToplay ? ((<ToPlay navigateToGame={this.navigateToGame} toggleToPlay={this.toggleToPlay}></ToPlay>)) : ''}
            {this.state.startGame ? ((<Game player1={this.state.player1} player2={this.state.player2}></Game>)) : ''}
            </div>
        )
    }   
}
