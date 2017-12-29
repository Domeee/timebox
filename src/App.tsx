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
    const seconds = this.padLeft(this.state.seconds);
    const minutes = this.padLeft(this.state.minutes);
    return (
      <div className="app" tabIndex={0} onKeyDown={this.handleKeyDown}>
        <TimeboxEventEmitter onChange={this.handleTimeboxChange}>
          <div className="content-container">
            <div className="clock">
              <span tabIndex={1} id="minutes">
                {minutes}
              </span>
              <span>:</span>
              <span tabIndex={2} id="seconds">
                {seconds}
              </span>
            </div>
            <button
              className="hidden"
              onClick={this.handleToggleCountdown}
              tabIndex={3}
            >
              {toggleText}
            </button>
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
        // 00:05 --> default case
        // 00:00
        // 01:00
        if (!this.state.isTimeboxStarted) {
          this.setState(prevState => {
            let seconds = prevState.seconds - 5;
            let minutes = prevState.minutes;
            if (seconds < MIN_VALUE && minutes === MIN_VALUE) {
              seconds = 0;
            } else if (seconds < MIN_VALUE && minutes > MIN_VALUE) {
              seconds = 55;
              minutes -= 1;
            }

            // -1 seconds because interval starts after 1 second
            const timer = minutes * 60 + seconds - 1;
            return { seconds, minutes, timer };
          });
        }
        break;
      case TimeboxEventType.INCREASE_SECONDS:
        if (!this.state.isTimeboxStarted && this.state.seconds < MAX_VALUE) {
          this.setState(prevState => {
            let seconds = prevState.seconds + 5;
            let minutes = prevState.minutes;
            if (seconds >= MAX_VALUE) {
              seconds = 0;
              if (minutes < MAX_VALUE) {
                minutes += 1;
              }
            }

            // -1 seconds because interval starts after 1 second
            const timer = minutes * 60 + seconds - 1;
            return { seconds, minutes, timer };
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
  // tslint:disable-next-line:no-any
  private padLeft(value: any): string {
    const pad = '00';
    const str = '' + value;
    return pad.substring(0, pad.length - str.length) + str;
  }
}

export default App;
