import './App.css';
import History from './History'
import Scheduler from './Scheduler'

require('dotenv').config();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          History Service UI of Awesomeness
        </p>
        <div className="history">
          <History />
        </div>
        <div className="scheduler">
          <Scheduler />
        </div>
      </header>
    </div>
  );
}

export default App;
