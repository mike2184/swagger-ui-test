import logo from './logo.svg';
import './App.css';
import History from './History'

require('dotenv').config();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload 123.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div className="history">
          <History></History>
        </div>
      </header>
    </div>
  );
}

export default App;
