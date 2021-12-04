import React from "react";
// import './App.css';
import { Redirect, Route} from "react-router-dom";
import Home from "./Home/Home";
import Game from "./Game/Game"
import Footter from "../components/Footter/Footter";



export default class App extends React.Component {

  render() {
    return (
      <div>
      <switch>
        <Route path="/home"><Home/></Route>
        <Route path="/game">
          <Game player1 ='first' player2='second'/>
        </Route>
        <Redirect from="*" to="/home"></Redirect>
      </switch>
      <Footter/>
      </div>
    );
  }
}
