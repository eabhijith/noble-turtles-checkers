import React from "react";
// import './App.css';
import { Redirect, Route} from "react-router-dom";
import Home from "./Home/Home";
import Game from "./Game/Game"
import Header from "./Header/Header";

export default class App extends React.Component {

  render() {
    return (
      <div>
      <switch>
        <Header/>
        <Route path="/home"><Home/></Route>
        <Route path="/game">
          <Game player1 ='first' player2='second'/>
        </Route>
        <Redirect from="*" to="/home"></Redirect>
      </switch>
      </div>
    );
  }
}
