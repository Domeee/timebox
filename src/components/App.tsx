import * as React from 'react';
import TimeboxEventEmitter from './TimeboxEventEmitter';
import TimeboxChangeEvent, {
  TimeboxChangeEventType,
} from '../lib/TimeboxChangeEvent';
import TimeboxUnit from '../lib/TimeboxUnit';
import SoundSelection from './SoundSelection';
import SoundChangeEvent from '../lib/SoundChangeEvent';
import ThemeChangeEvent from '../lib/ThemeChangeEvent';
import TimeboxToggle from './TimeboxToggle';
import Clock from './Clock';

import logoInnoarchitects from './logo-innoarchitects.svg';

import './App.css';

export interface AppState {
  seconds: number;
  minutes: number;
  hours: number;
  isTimeboxStarted: boolean;
  timer: number;
  theme: number;
}

class App extends React.Component<{}, AppState> {
  private timeboxInterval: number;
  private flashBackgroundInterval: number;
  private song = SoundSelection.DefaultSound;
  private container: HTMLDivElement;
  private isFlashed: boolean;
  private originalBackground: string;
  private themes = [
    'dark',
    'red',
    'purple',
    'blue',
    'cyan',
    'teal',
    'green',
    'yellow',
    'amber',
  ];

  constructor(props: {}) {
    super(props);
    this.state = {
      seconds: 0,
      minutes: 0,
      hours: 0,
      isTimeboxStarted: false,
      timer: 0,
      theme: 0,
    };
    this.handleTimeboxChange = this.handleTimeboxChange.bind(this);
    this.handleTimeboxToggle = this.handleTimeboxToggle.bind(this);
    this.handleTimeboxTick = this.handleTimeboxTick.bind(this);
    this.handleSoundChange = this.handleSoundChange.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
    this.flashBackground = this.flashBackground.bind(this);
  }

  public render() {
    const appClasses = `app ${this.themes[this.state.theme]}`;
    return (
      <div
        className={appClasses}
        ref={container => {
          this.container = container!;
        }}
      >
        <div className="sound-selection-container">
          <SoundSelection onSoundChange={this.handleSoundChange} />
        </div>
        <TimeboxEventEmitter
          onTimeboxChange={this.handleTimeboxChange}
          onTimeboxToggle={this.handleTimeboxToggle}
          onThemeChange={this.handleThemeChange}
        >
          <div className="clock-container">
            <Clock
              seconds={this.state.seconds}
              minutes={this.state.minutes}
              hours={this.state.hours}
              isTimeboxStarted={this.state.isTimeboxStarted}
            />
          </div>
          <div className="timebox-toggle-container">
            <TimeboxToggle
              isTimeboxStarted={this.state.isTimeboxStarted}
              onTimeboxToggle={this.handleTimeboxToggle}
            />
          </div>
          <div className="logo-container">
            <a href="https://innoarchitects.ch">
              <img
                src={logoInnoarchitects}
                className="logo-ia"
                alt="INNOArchitects"
              />
            </a>
          </div>
        </TimeboxEventEmitter>
      </div>
    );
  }

  public componentDidMount() {
    this.updateOriginalBackground();
  }

  public componentDidUpdate(prevState: AppState) {
    if (this.state.theme !== prevState.theme) {
      this.updateOriginalBackground();
    }
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
    let theme = this.state.theme;
    if (e.next) {
      theme = this.state.theme + 1;
      theme = theme < this.themes.length ? theme : 0;
    } else {
      theme = this.state.theme - 1;
      theme = theme >= 0 ? theme : this.themes.length - 1;
    }
    const style = window.getComputedStyle(this.container);
    this.originalBackground = style.backgroundColor!;
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
      this.flashBackgroundInterval = window.setInterval(
        this.flashBackground,
        500
      );
      // Stop the visual after 10 secs
      window.setTimeout(() => {
        window.clearInterval(this.flashBackgroundInterval);
        this.container.style.backgroundColor = '';
        // tslint:disable-next-line:align
      }, 10000);
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

  private calculateDisplayTime(timer: number) {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor(timer / 60) - hours * 60;
    const seconds = timer - hours * 3600 - minutes * 60;
    const res = { seconds, minutes, hours };
    return res;
  }

  private flashBackground() {
    this.container.style.backgroundColor = this.isFlashed
      ? this.originalBackground
      : '#f44336';

    this.isFlashed = !this.isFlashed;
  }

  private updateOriginalBackground() {
    const style = window.getComputedStyle(this.container);
    this.originalBackground = style.backgroundColor!;
  }
}

export default App;
