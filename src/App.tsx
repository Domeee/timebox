import * as React from 'react';
import CounterLabel from './CounterLabel';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div className="counter-container">
          <CounterLabel initValue={15} maxValue={640} />
          <div className="Counter-label-separator">:</div>
          <CounterLabel initValue={23} maxValue={59} />
        </div>
      </div>
    );
  }
}

export default App;
