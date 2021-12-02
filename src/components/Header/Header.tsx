import { Component} from 'react'
import 'bulma/css/bulma.min.css';

interface HeaderProps {
  toggleRules?:any
  toggleToPlay?:any

}

interface HeaderState {
  gitHubUrl : string;
  gitHubIssue : string;
}

export default class  Header extends Component<HeaderProps,HeaderState> {

  //Constructor for Home Page
    constructor(props : HeaderProps) {
        super(props);
        // this.toggleRules = this.toggleRules.bind(this);
        // this.toggleToPlay = this.toggleToPlay.bind(this);
        // this.toggleRules = this.toggleRules.bind(this);
    }

    //Define State on To Play Page
    public readonly state: HeaderState = {
        gitHubUrl : 'https://github.com/eabhijith/noble-turtles-checkers',
        gitHubIssue : 'https://github.com/eabhijith/noble-turtles-checkers/issues/new'
	  }

    public refreshPage(): void {
    window.location.reload();
    }

    public loadGitHub() : void {
      window.open(this.state.gitHubUrl, "_blank");
    }

    public loadGitHubIssue() : void {
      window.open(this.state.gitHubIssue, "_blank");
    }
    public render(): JSX.Element {
      return (
          <div>
              <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <a className="navbar-item" href="https://noble-turtles-checkers.web.app/home">
        <img src="https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2VhJTIwdHVydGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80" 
        width="112" height="28"/>
      </a>
  
      <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
  
    <div id="navbarBasicExample" className="navbar-menu">
      <div className="navbar-start">
        <a onClick={() => this.refreshPage()} className="navbar-item">
          Home
        </a>
  
        <a  onClick={() => this.props.toggleToPlay()} className="navbar-item">
          Play Game
        </a>
        <a onClick={() => this.props.toggleRules()} className="navbar-item">
          Rules
        </a>
  
        <div className="navbar-item has-dropdown is-hoverable">
          <a className="navbar-link">
            More
          </a>
  
          <div className="navbar-dropdown">
            <a onClick={() => this.loadGitHub()} className="navbar-item">
              Code Base
            </a>
            <a onClick={() => this.loadGitHubIssue()} className="navbar-item">
              Report an issue
            </a>
          </div>
        </div>
      </div>
      </div>
      </nav>
          </div>
      );
    }
}
