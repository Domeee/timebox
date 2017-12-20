import * as React from 'react';
import TimeboxEventEmitter from './TimeboxEventEmitter';
import CounterLabel from './CounterLabel';
import './App.css';
import TimeboxEvent, { TimeboxEventType } from './TimeboxEvent';

export interface AppState {
  seconds: number;
  minutes: number;
}

const MIN_VALUE: number = 0;
const MAX_VALUE: number = 59;

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      seconds: 0,
      minutes: 0
    };
    this.handleTimeboxChange = this.handleTimeboxChange.bind(this);
  }

  public render() {
    return (
      <div className="app">
        <TimeboxEventEmitter onChange={this.handleTimeboxChange}>
          <div className="counter-container">
            <CounterLabel value={this.state.minutes} />
            <div className="Counter-label-separator">:</div>
            <CounterLabel value={this.state.seconds} />
          </div>
        </TimeboxEventEmitter>
      </div>
    );
  }

  private handleTimeboxChange(e: TimeboxEvent) {
    switch (e.type) {
      case TimeboxEventType.DECREASE_SECONDS:
        if (this.state.seconds > MIN_VALUE) {
          this.setState(prevState => {
            return { seconds: prevState.seconds - 1 };
          });
        }
        break;
      case TimeboxEventType.INCREASE_SECONDS:
        if (this.state.seconds < MAX_VALUE) {
          this.setState(prevState => {
            return { seconds: prevState.seconds + 1 };
          });
        }
        break;
      case TimeboxEventType.DECREASE_MINUTES:
        if (this.state.minutes > MIN_VALUE) {
          this.setState(prevState => {
            return { minutes: prevState.minutes - 1 };
          });
        }
        break;
      case TimeboxEventType.INCREASE_MINUTES:
        if (this.state.minutes < MAX_VALUE) {
          this.setState(prevState => {
            return { minutes: prevState.minutes + 1 };
          });
        }
        break;
      default:
        break;
    }
  }
}

export default App;
