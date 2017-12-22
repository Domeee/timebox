import * as React from 'react';
import TimeboxEventEmitter from './TimeboxEventEmitter';
import TimeboxEvent, { TimeboxEventType } from './TimeboxEvent';

export interface AppState {
  seconds: number;
  minutes: number;
  isTimeboxStarted: boolean;
  timer: number;
}

const MIN_VALUE: number = 0;
const MAX_VALUE: number = 59;

class App extends React.Component<{}, AppState> {
  private timeboxInterval: number;
  constructor(props: {}) {
    super(props);
    this.state = {
      seconds: 0,
      minutes: 0,
      isTimeboxStarted: false,
      timer: 0,
    };
    this.handleTimeboxChange = this.handleTimeboxChange.bind(this);
    this.handleToggleCountdown = this.handleToggleCountdown.bind(this);
    this.handleTimeboxTick = this.handleTimeboxTick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  public render() {
    const toggleText = this.state.isTimeboxStarted ? 'Stop' : 'Start';
    return (
      <div className="app" tabIndex={0} onKeyDown={this.handleKeyDown}>
        <TimeboxEventEmitter onChange={this.handleTimeboxChange}>
          <span tabIndex={1} id="minutes">
            {this.state.minutes}
          </span>
          <span>:</span>
          <span tabIndex={2} id="seconds">
            {this.state.seconds}
          </span>
          <button onClick={this.handleToggleCountdown} tabIndex={3}>
            {toggleText}
          </button>
          <div>
            <div>
              Swipe-up / down on the left hand side to increment / decrement the
              minutes timer by 1
            </div>
            <div>
              Swipe-up / down on the right hand side to increment / decrement
              the seconds timer by 1
            </div>
            <div>
              Double-Click on the left hand side to increment the minutes timer
              by 5
            </div>
          </div>
        </TimeboxEventEmitter>
      </div>
    );
  }
  // tslint:disable-next-line:no-any
  private handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    const activeElement = document.activeElement;
    if (e.key === 'ArrowUp') {
      if (activeElement.id === 'minutes') {
        this.handleTimeboxChange({ type: TimeboxEventType.INCREASE_MINUTES });
      } else {
        this.handleTimeboxChange({ type: TimeboxEventType.INCREASE_SECONDS });
      }
    } else if (e.key === 'ArrowDown') {
      if (activeElement.id === 'minutes') {
        this.handleTimeboxChange({ type: TimeboxEventType.DECREASE_MINUTES });
      } else {
        this.handleTimeboxChange({ type: TimeboxEventType.DECREASE_SECONDS });
      }
    }
  }
  private handleTimeboxChange(e: TimeboxEvent) {
    switch (e.type) {
      case TimeboxEventType.DECREASE_SECONDS:
        if (!this.state.isTimeboxStarted && this.state.seconds > MIN_VALUE) {
          this.setState(prevState => {
            let seconds = prevState.seconds - 5;
            seconds = seconds === 54 ? 55 : seconds;

            // -1 seconds because interval starts after 1 second
            const timer = prevState.minutes * 60 + seconds - 1;
            return { seconds, timer };
          });
        }
        break;
      case TimeboxEventType.INCREASE_SECONDS:
        if (!this.state.isTimeboxStarted && this.state.seconds < MAX_VALUE) {
          this.setState(prevState => {
            let seconds = prevState.seconds + 5;
            seconds = seconds > MAX_VALUE ? MAX_VALUE : seconds;

            // -1 seconds because interval starts after 1 second
            const timer = prevState.minutes * 60 + seconds - 1;
            return { seconds, timer };
          });
        }
        break;
      case TimeboxEventType.DECREASE_MINUTES:
        if (!this.state.isTimeboxStarted && this.state.minutes > MIN_VALUE) {
          this.setState(prevState => {
            const minutes = prevState.minutes - 1;

            // -1 seconds because interval starts after 1 second
            const timer = minutes * 60 + prevState.seconds - 1;
            return { minutes, timer };
          });
        }
        break;
      case TimeboxEventType.INCREASE_MINUTES:
        if (!this.state.isTimeboxStarted && this.state.minutes < MAX_VALUE) {
          this.setState(prevState => {
            const minutes = prevState.minutes + 1;

            // -1 seconds because interval starts after 1 second
            const timer = minutes * 60 + prevState.seconds - 1;
            return { minutes, timer };
          });
        }
        break;
      case TimeboxEventType.INCREASE_MINUTES_BIGTIME:
        if (!this.state.isTimeboxStarted && this.state.minutes < MAX_VALUE) {
          this.setState(prevState => {
            let minutes = prevState.minutes + 5;
            minutes = minutes > MAX_VALUE ? MAX_VALUE : minutes;

            // -1 seconds because interval starts after 1 second
            const timer = minutes * 60 + prevState.seconds - 1;
            return { minutes, timer };
          });
        }
        break;
      default:
        break;
    }
  }

  private handleToggleCountdown() {
    if (this.state.isTimeboxStarted) {
      this.setState({ isTimeboxStarted: false });
      window.clearInterval(this.timeboxInterval);
      this.setState(prevState => {
        return { timer: 0, seconds: 0, minutes: 0 };
      });
    } else {
      this.setState({ isTimeboxStarted: true });
      this.timeboxInterval = window.setInterval(this.handleTimeboxTick, 1000);
    }
  }

  private handleTimeboxTick() {
    if (this.state.timer > 0) {
      const minutes = Math.floor(this.state.timer / 60);
      const seconds = this.state.timer - minutes * 60;
      this.setState(prevState => {
        return { timer: prevState.timer - 1, seconds, minutes };
      });
    } else {
      this.setState({ isTimeboxStarted: false });
      window.clearInterval(this.timeboxInterval);
      this.setState(prevState => {
        return { timer: 0, seconds: 0, minutes: 0 };
      });
    }
  }
}

export default App;