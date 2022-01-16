import logo from './logo.svg';
import './App.css';
import {Link, Outlet} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="">
        <nav>
          <ul>
            <li><Link to="/chat">Chat</Link></li>
            <li><Link to="/map">Map</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/">Home</Link></li>
          </ul>
        </nav>
        <h1>Study Buddies App</h1>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
