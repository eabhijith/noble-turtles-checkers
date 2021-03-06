import { Component} from 'react'
import 'bulma/css/bulma.min.css';

interface FootterProps {

}

interface FootterState {
}

export default class  Footter extends Component<FootterProps,FootterState> {
    public render(): JSX.Element {
      return (
          <div>
            <footer className="footer">
                <div className="content has-text-centered">
                    <p>
                    <strong>© {new Date().getFullYear()} Noble-Turtles-Checkers</strong> 
                    The <a href="https://github.com/eabhijith/noble-turtles-checkers"> Source Code</a>. is a student project
                    </p>
                </div>
            </footer>
          </div>
      );
    }
}
