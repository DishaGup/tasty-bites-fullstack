import logo from './logo.svg';
import './App.css';
import HomePage from './components/Navbar';
import AllRoutes from './components/AllRoutes';

function App() {
  return (
    <div className="App">
    
     <HomePage/>
     <AllRoutes/>
     <div className="footer-bottom">
        <div className="container">
          <p className="copyright-text">Enjoy tasty foods</p>
        </div>
      </div>
    </div>
  );
}

export default App;
