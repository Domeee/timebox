import * as React from 'react';
import TimeboxEventEmitter from './TimeboxEventEmitter';
import TimeboxChangeEvent, {
  TimeboxChangeEventType,
} from '../lib/TimeboxChangeEvent';
import TimeboxUnit from '../lib/TimeboxUnit';
import SoundSelection from './SoundSelection';
import SoundChangeEvent from '../lib/SoundChangeEvent';
import Theme from '../lib/Theme';
import ThemeChangeEvent from '../lib/ThemeChangeEvent';

import './App.css';

export interface AppState {
  seconds: number;
  minutes: number;
  hours: number;
  isTimeboxStarted: boolean;
  timer: number;
  theme: Theme;
}

class App extends React.Component<{}, AppState> {
  private timeboxInterval: number;
  private song = SoundSelection.DefaultSound;

  constructor(props: {}) {
    super(props);
    this.state = {
      seconds: 0,
      minutes: 0,
      hours: 0,
      isTimeboxStarted: false,
      timer: 0,
      theme: Theme.Dark,
    };
    this.handleTimeboxChange = this.handleTimeboxChange.bind(this);
    this.handleTimeboxToggle = this.handleTimeboxToggle.bind(this);
    this.handleTimeboxTick = this.handleTimeboxTick.bind(this);
    this.handleSoundChange = this.handleSoundChange.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
  }

  public render() {
    const toggleText = this.state.isTimeboxStarted ? 'Stop' : 'Start';
    const seconds = this.padLeft(this.state.seconds);
    const minutes = this.padLeft(this.state.minutes);
    const hours = this.padLeft(this.state.hours);
    const appClasses = `app ${Theme[this.state.theme].toLowerCase()}`;
    return (
      <div className={appClasses}>
        <TimeboxEventEmitter
          onTimeboxChange={this.handleTimeboxChange}
          onTimeboxToggle={this.handleTimeboxToggle}
          onThemeChange={this.handleThemeChange}
        >
          <div className="content-container">
            <SoundSelection onSoundChange={this.handleSoundChange} />
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
        return { timer: 0, seconds: 0, minutes: 0, hours: 0 };
      });
    } else {
      this.setState({ isTimeboxStarted: true });
      this.timeboxInterval = window.setInterval(this.handleTimeboxTick, 1000);
    }
  }

  private handleThemeChange(e: ThemeChangeEvent) {
    const theme = e.next ? Theme.Green : Theme.Dark;

    this.setState({
      theme,
    });
  }

  private handleTimeboxTick() {
    if (this.state.timer > 1) {
      this.setState(prevState => {
        const timer = prevState.timer - 1;
        const { seconds, minutes, hours } = this.calculateDisplayTime(timer);
        return { timer, seconds, minutes, hours };
      });
    } else {
      this.playSound();
      this.setState({ isTimeboxStarted: false });
      window.clearInterval(this.timeboxInterval);
      this.setState(prevState => {
        return { timer: 0, seconds: 0, minutes: 0, hours: 0 };
      });
    }
  }

  private handleSoundChange(e: SoundChangeEvent) {
    this.song = e.newSound;
  }

  private playSound() {
    if (this.song !== SoundSelection.SilentSound) {
      const song = this.song + '.mp3';
      const audio = new Audio(song);
      audio.play();
    }
  }

  private padLeft(value: number): string {
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
