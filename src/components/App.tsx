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
  private themes = ['dark', 'blue', 'yellow', 'pink', 'green'];

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="logo-ia"
                viewBox="0 -7 258 43"
              >
                <path
                  // tslint:disable-next-line:max-line-length
                  d="M121.318 27.936L110.628.934h-4.093L95.884 27.936h3.775l2.345-5.992h13.193l2.345 5.992h3.776zm-7.113-8.988h-11.247l5.643-14.534 5.604 14.534zm12.327 8.988V14.09c.875-1.579 3.378-3.117 5.206-3.117.478 0 .835.041 1.191.122V7.977c-2.623 0-4.848 1.498-6.397 3.563V8.381h-2.98v19.555h2.98m17.493.486c3.498 0 5.563-1.458 7.035-3.4l-1.988-1.862c-1.271 1.741-2.9 2.551-4.887 2.551-4.095 0-6.638-3.237-6.638-7.569 0-4.333 2.543-7.531 6.638-7.531 1.985 0 3.614.769 4.887 2.55l1.988-1.862c-1.472-1.943-3.537-3.4-7.035-3.4-5.724 0-9.576 4.453-9.576 10.243 0 5.827 3.854 10.28 9.576 10.28m26.079-.486V14.13c0-4.251-2.104-6.234-6.119-6.234-2.9 0-5.523 1.7-6.875 3.32V.933h-2.979v27.002h2.979v-14.29c1.152-1.579 3.377-3.036 5.683-3.036 2.584 0 4.332 1.012 4.332 4.454v12.873h2.979m6.328-22.348a2.02 2.02 0 0 0 2.025-2.024c0-1.134-.914-2.065-2.025-2.065-1.074 0-1.988.931-1.988 2.065-.001 1.133.913 2.024 1.988 2.024zm-1.471 22.348h2.98V8.381h-2.98v19.555zm12.685.486c1.748 0 2.82-.527 3.576-1.256l-.875-2.268c-.396.445-1.19.811-2.025.811-1.312 0-1.947-1.053-1.947-2.51V11.054h3.895V8.381h-3.895V3.038h-2.98v5.344h-3.179v2.672h3.179v12.793c0 2.915 1.429 4.575 4.251 4.575m14.393 0c3.141 0 5.723-1.053 7.631-2.996l-1.432-1.984c-1.51 1.58-3.734 2.472-5.92 2.472-4.133 0-6.678-3.078-6.916-6.763h15.539v-.77c0-5.87-3.418-10.485-9.221-10.485-5.482 0-9.457 4.575-9.457 10.243.001 6.113 4.094 10.283 9.776 10.283zm5.962-11.498h-12.599c.16-2.996 2.187-6.518 6.279-6.518 4.374 0 6.28 3.603 6.32 6.518zm15.108 11.498c3.498 0 5.563-1.458 7.035-3.4l-1.987-1.862c-1.271 1.741-2.901 2.551-4.888 2.551-4.095 0-6.638-3.237-6.638-7.569 0-4.333 2.543-7.531 6.638-7.531 1.985 0 3.615.769 4.888 2.55l1.987-1.862c-1.472-1.943-3.537-3.4-7.035-3.4-5.723 0-9.576 4.453-9.576 10.243 0 5.827 3.856 10.28 9.576 10.28m14.952 0c1.75 0 2.822-.527 3.578-1.256l-.875-2.268c-.397.445-1.193.811-2.027.811-1.312 0-1.946-1.053-1.946-2.51V11.054h3.896V8.381h-3.896V3.038h-2.979v5.344h-3.181v2.672h3.181v12.793c-.003 2.915 1.426 4.575 4.249 4.575m11.811 0c4.968 0 7.55-2.632 7.55-5.911 0-7.611-11.882-4.776-11.882-9.069 0-1.741 1.63-3.077 4.253-3.077 2.463 0 4.568 1.053 5.723 2.47l1.392-2.105c-1.552-1.579-3.854-2.833-7.113-2.833-4.569 0-7.153 2.591-7.153 5.627 0 7.246 11.883 4.332 11.883 9.068 0 1.943-1.59 3.36-4.53 3.36-2.623 0-5.048-1.296-6.319-2.794l-1.549 2.188c1.943 2.103 4.605 3.076 7.745 3.076M71.917 14.445c0-1.187-.946-2.15-2.111-2.15-1.167 0-2.113.963-2.113 2.15s.946 2.151 2.113 2.151c1.164 0 2.111-.964 2.111-2.151m19.541-2.152c-1.165 0-2.111.964-2.111 2.151 0 1.189.946 2.154 2.111 2.154s2.111-.965 2.111-2.154c0-1.187-.946-2.151-2.111-2.151M86.53 5.91c1.165 0 2.111-.964 2.111-2.151 0-1.188-.946-2.152-2.111-2.152-1.166 0-2.114.964-2.114 2.152.001 1.186.949 2.151 2.114 2.151M74.764 1.606c-1.165 0-2.111.964-2.111 2.15 0 1.188.946 2.153 2.111 2.153s2.111-.964 2.111-2.153c0-1.186-.946-2.15-2.111-2.15M86.53 22.954c-1.166 0-2.114.964-2.114 2.149 0 1.188.948 2.153 2.114 2.153 1.165 0 2.111-.965 2.111-2.153 0-1.185-.946-2.149-2.111-2.149m-11.766 0c-1.165 0-2.113.964-2.113 2.149 0 1.188.948 2.153 2.113 2.153s2.111-.965 2.111-2.153c0-1.185-.946-2.149-2.111-2.149M90.39 10.688c1.166 0 2.111-.966 2.111-2.15 0-1.188-.946-2.153-2.111-2.153s-2.113.964-2.113 2.153c0 1.184.948 2.15 2.113 2.15m-19.487 0c1.165 0 2.111-.966 2.111-2.15 0-1.188-.946-2.153-2.111-2.153s-2.111.964-2.111 2.153c0 1.184.946 2.15 2.111 2.15m19.487 7.514c-1.165 0-2.113.964-2.113 2.149 0 1.188.948 2.153 2.113 2.153 1.166 0 2.111-.965 2.111-2.153 0-1.185-.946-2.149-2.111-2.149m-19.487 0c-1.165 0-2.111.964-2.111 2.149 0 1.188.946 2.153 2.111 2.153s2.111-.965 2.111-2.153c.001-1.185-.946-2.149-2.111-2.149M80.646.046c-1.165 0-2.113.964-2.113 2.153 0 1.187.948 2.15 2.113 2.15s2.111-.964 2.111-2.15c0-1.188-.945-2.153-2.111-2.153m0 24.495c-1.165 0-2.113.965-2.113 2.15 0 1.188.948 2.152 2.113 2.152s2.111-.964 2.111-2.152c0-1.185-.945-2.15-2.111-2.15m-38.151-.377c-1.165 0-2.111.964-2.111 2.15 0 1.188.946 2.151 2.111 2.151s2.111-.965 2.111-2.151-.946-2.15-2.111-2.15m.047-5.935c-1.165 0-2.111.965-2.111 2.15 0 1.188.946 2.153 2.111 2.153s2.113-.966 2.113-2.153c0-1.186-.948-2.15-2.113-2.15m-.064-5.935c-1.165 0-2.113.964-2.113 2.153 0 1.186.948 2.151 2.113 2.151s2.113-.965 2.113-2.151c0-1.189-.948-2.153-2.113-2.153m.017-5.933c-1.165 0-2.111.964-2.111 2.153 0 1.185.946 2.15 2.111 2.15s2.111-.966 2.111-2.15c0-1.189-.946-2.153-2.111-2.153m0-5.934c-1.165 0-2.111.964-2.111 2.153 0 1.187.946 2.15 2.111 2.15s2.111-.964 2.111-2.15c0-1.189-.946-2.153-2.111-2.153m7.997 9.117c0-1.187-.946-2.15-2.111-2.15-1.167 0-2.113.963-2.113 2.15s.947 2.15 2.113 2.15c1.165.001 2.111-.963 2.111-2.15m3.204 4.903c0-1.187-.948-2.15-2.111-2.15-1.167 0-2.113.963-2.113 2.15s.946 2.151 2.113 2.151c1.163 0 2.111-.964 2.111-2.151m1.172 2.976c-1.165 0-2.111.964-2.111 2.152 0 1.187.946 2.151 2.111 2.151s2.111-.966 2.111-2.151c0-1.188-.946-2.152-2.111-2.152m5.803 6.741c-1.165 0-2.111.964-2.111 2.15 0 1.188.946 2.151 2.111 2.151s2.111-.965 2.111-2.151-.946-2.15-2.111-2.15m0-5.935c-1.165 0-2.111.965-2.111 2.15 0 1.188.946 2.153 2.111 2.153s2.113-.966 2.113-2.153c.001-1.186-.948-2.15-2.113-2.15m0-5.934c-1.165 0-2.111.964-2.111 2.153 0 1.187.946 2.149 2.111 2.149s2.113-.964 2.113-2.149c.001-1.188-.948-2.153-2.113-2.153m0-5.934c-1.165 0-2.111.964-2.111 2.153 0 1.185.946 2.15 2.111 2.15s2.111-.966 2.111-2.15c0-1.189-.946-2.153-2.111-2.153m0-5.934c-1.165 0-2.111.964-2.111 2.153 0 1.187.946 2.15 2.111 2.15s2.113-.964 2.113-2.15c.001-1.189-.948-2.153-2.113-2.153M13.605 24.164c-1.165 0-2.111.964-2.111 2.15 0 1.188.946 2.151 2.111 2.151s2.111-.965 2.111-2.151-.945-2.15-2.111-2.15m.047-5.935c-1.165 0-2.113.965-2.113 2.15 0 1.188.948 2.153 2.113 2.153s2.111-.966 2.111-2.153c0-1.186-.946-2.15-2.111-2.15m-.064-5.935c-1.165 0-2.111.964-2.111 2.153 0 1.186.946 2.151 2.111 2.151s2.111-.965 2.111-2.151c0-1.189-.946-2.153-2.111-2.153m.017-5.933c-1.165 0-2.111.964-2.111 2.153 0 1.185.946 2.15 2.111 2.15s2.111-.966 2.111-2.15c0-1.189-.945-2.153-2.111-2.153m0-5.934c-1.165 0-2.111.964-2.111 2.153 0 1.187.946 2.15 2.111 2.15s2.113-.964 2.113-2.15c0-1.189-.947-2.153-2.113-2.153m7.998 9.117c0-1.187-.947-2.15-2.111-2.15-1.167 0-2.113.963-2.113 2.15s.947 2.15 2.113 2.15c1.164.001 2.111-.963 2.111-2.15m3.203 4.903c0-1.187-.948-2.15-2.113-2.15s-2.111.963-2.111 2.15.946 2.151 2.111 2.151 2.113-.964 2.113-2.151m1.173 2.976c-1.165 0-2.111.964-2.111 2.152 0 1.187.946 2.151 2.111 2.151s2.111-.966 2.111-2.151c-.001-1.188-.946-2.152-2.111-2.152m5.803 6.741c-1.165 0-2.113.964-2.113 2.15 0 1.188.948 2.151 2.113 2.151s2.111-.965 2.111-2.151-.946-2.15-2.111-2.15m0-5.935c-1.165 0-2.113.965-2.113 2.15 0 1.188.948 2.153 2.113 2.153s2.113-.966 2.113-2.153c0-1.186-.948-2.15-2.113-2.15m0-5.934c-1.165 0-2.113.964-2.113 2.153 0 1.187.948 2.149 2.113 2.149s2.113-.964 2.113-2.149c0-1.188-.948-2.153-2.113-2.153m0-5.934c-1.165 0-2.113.964-2.113 2.153 0 1.185.948 2.15 2.113 2.15s2.111-.966 2.111-2.15c0-1.189-.946-2.153-2.111-2.153m0-5.934c-1.165 0-2.113.964-2.113 2.153 0 1.187.948 2.15 2.113 2.15s2.113-.964 2.113-2.15c0-1.189-.948-2.153-2.113-2.153M2.932 24.164c-1.165 0-2.111.964-2.111 2.15 0 1.188.946 2.151 2.111 2.151s2.111-.965 2.111-2.151-.946-2.15-2.111-2.15m0-5.935c-1.165 0-2.111.965-2.111 2.15 0 1.188.946 2.153 2.111 2.153s2.111-.966 2.111-2.153c0-1.186-.946-2.15-2.111-2.15m0-5.934c-1.165 0-2.111.964-2.111 2.153 0 1.187.946 2.149 2.111 2.149s2.111-.964 2.111-2.149c0-1.188-.946-2.153-2.111-2.153m0-5.934c-1.165 0-2.111.964-2.111 2.153 0 1.185.946 2.15 2.111 2.15s2.111-.966 2.111-2.15c0-1.189-.946-2.153-2.111-2.153m0-5.934C1.767.427.821 1.391.821 2.58c0 1.187.946 2.15 2.111 2.15s2.111-.964 2.111-2.15c0-1.189-.946-2.153-2.111-2.153"
                />
              </svg>
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
