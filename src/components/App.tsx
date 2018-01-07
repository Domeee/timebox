import * as React from 'react';
import TimeboxEventEmitter from './TimeboxEventEmitter';
import TimeboxChangeEvent, {
  TimeboxChangeEventType,
} from '../lib/TimeboxChangeEvent';
import TimeboxUnit from '../lib/TimeboxUnit';

export interface AppState {
  seconds: number;
  minutes: number;
  hours: number;
  isTimeboxStarted: boolean;
  timer: number;
}

class App extends React.Component<{}, AppState> {
  private timeboxInterval: number;
  constructor(props: {}) {
    super(props);
    this.state = {
      seconds: 0,
      minutes: 0,
      hours: 0,
      isTimeboxStarted: false,
      timer: 0,
    };
    this.handleTimeboxChange = this.handleTimeboxChange.bind(this);
    this.handleTimeboxToggle = this.handleTimeboxToggle.bind(this);
    this.handleTimeboxTick = this.handleTimeboxTick.bind(this);
  }

  public render() {
    const toggleText = this.state.isTimeboxStarted ? 'Stop' : 'Start';
    const seconds = this.padLeft(this.state.seconds);
    const minutes = this.padLeft(this.state.minutes);
    const hours = this.padLeft(this.state.hours);
    return (
      <div className="app">
        <TimeboxEventEmitter
          onTimeboxChange={this.handleTimeboxChange}
          onTimeboxToggle={this.handleTimeboxToggle}
        >
          <div className="content-container">
            <div className="clock">
              <span>{hours}</span>
              <span>:</span>
              <span>{minutes}</span>
              <span>:</span>
              <span>{seconds}</span>
            </div>
            <button onClick={this.handleTimeboxToggle}>{toggleText}</button>
          </div>
        </TimeboxEventEmitter>
      </div>
    );
  }
  private handleTimeboxChange(e: TimeboxChangeEvent) {
    if (this.state.isTimeboxStarted) return;
    if (
      this.state.timer < TimeboxUnit.SECONDS &&
      e.type === TimeboxChangeEventType.DECREASE_UNIT
    )
      return;

    this.setState(prevState => {
      const timer =
        e.type === TimeboxChangeEventType.INCREASE_UNIT
          ? prevState.timer + e.unit
          : prevState.timer - e.unit;
      if (timer >= 0) {
        const { seconds, minutes, hours } = this.calculateDisplayTime(timer);
        return { timer, seconds, minutes, hours };
      } else {
        return this.state;
      }
    });
  }
  private handleTimeboxToggle() {
    if (this.state.isTimeboxStarted) {
      this.setState({ isTimeboxStarted: false });
      window.clearInterval(this.timeboxInterval);
      this.setState(prevState => {
        return { timer: 0, seconds: 0, minutes: 0 };
      });
    } else {
      this.setState({ isTimeboxStarted: true });
      this.timeboxInterval = window.setInterval(this.handleTimeboxTick, 1000);

      // Direct call to handleTimeboxTick() so the UI updates right away
      this.handleTimeboxTick();
    }
  }

  private handleTimeboxTick() {
    if (this.state.timer > 0) {
      this.setState(prevState => {
        const timer = prevState.timer - 1;
        const { seconds, minutes, hours } = this.calculateDisplayTime(timer);
        return { timer, seconds, minutes, hours };
      });
    } else {
      this.setState({ isTimeboxStarted: false });
      window.clearInterval(this.timeboxInterval);
      this.setState(prevState => {
        return { timer: 0, seconds: 0, minutes: 0, hours: 0 };
      });
    }
  }
  // tslint:disable-next-line:no-any
  private padLeft(value: any): string {
    const pad = '00';
    const str = '' + value;
    return pad.substring(0, pad.length - str.length) + str;
  }
  private calculateDisplayTime(timer: number) {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor(timer / 60) - hours * 60;
    const seconds = timer - hours * 3600 - minutes * 60;
    const res = { seconds, minutes, hours };
    return res;
  }
}

export default App;
