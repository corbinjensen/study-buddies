import logo from './logo.svg';
import './App.css';
import {Link, Outlet} from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
