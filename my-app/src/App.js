import './App.css';
import {Outlet} from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import AzureCaller from './AzureCaller';

function App() {
  return (
    <div className="p-3">
      <Header />
      <Outlet />
      <AzureCaller/>
      <Footer />
    </div>
  );
}

export default App;
