import * as React from 'react';
import { Howl } from 'howler';
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
import LogoIa from './LogoIa';
import Nudge from './Nudge';
import ThemeSwiper from './ThemeSwiper';
import Sounds from './Sounds';
import { Sound } from './Sound';
// @ts-ignore
import Gong from '../sounds/gong.mp3';

import './App.css';

export interface AppState {
  seconds: number;
  minutes: number;
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
  private themes = ['dark', 'blue', 'yellow', 'pink', 'purple'];

  constructor(props: {}) {
    super(props);
    this.state = {
      seconds: 0,
      minutes: 0,
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
        <TimeboxEventEmitter
          onTimeboxChange={this.handleTimeboxChange}
          onTimeboxToggle={this.handleTimeboxToggle}
          onThemeChange={this.handleThemeChange}
        >
          <div className="header-container">
            <SoundSelection onSoundChange={this.handleSoundChange} />
            <LogoIa />
          </div>
          <div className="clock-container">
            <ThemeSwiper
              forward={false}
              onThemeChange={this.handleThemeChange}
            />
            <Clock
              seconds={this.state.seconds}
              minutes={this.state.minutes}
              isTimeboxStarted={this.state.isTimeboxStarted}
            />
            <ThemeSwiper
              forward={true}
              onThemeChange={this.handleThemeChange}
            />
          </div>
          <div className="timebox-toggle-container">
            <Nudge
              forward={false}
              unit={15}
              onTimeboxChange={this.handleTimeboxChange}
              visible={this.state.isTimeboxStarted}
            />
            <TimeboxToggle
              isTimeboxStarted={this.state.isTimeboxStarted}
              onTimeboxToggle={this.handleTimeboxToggle}
            />
            <Nudge
              forward={true}
              unit={15}
              onTimeboxChange={this.handleTimeboxChange}
              visible={this.state.isTimeboxStarted}
            />
          </div>
          <div
            className="theme-switch"
            onClick={e => this.handleThemeChange({ next: true })}
          />
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
    if (this.state.isTimeboxStarted && !e.nudge) return;
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
        const { seconds, minutes } = this.calculateDisplayTime(timer);
        return { ...prevState, timer, seconds, minutes };
      } else {
        return prevState;
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
      this.unlockSoundPlayback();
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
    this.originalBackground = style.background!;
    this.setState({
      theme,
    });
  }

  private handleTimeboxTick() {
    if (this.state.timer > 1) {
      this.setState(prevState => {
        const timer = prevState.timer - 1;
        const { seconds, minutes } = this.calculateDisplayTime(timer);
        return { timer, seconds, minutes };
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
        this.container.style.background = '';
        // tslint:disable-next-line:align
      }, 3000);
      this.setState({ isTimeboxStarted: false });
      window.clearInterval(this.timeboxInterval);
      this.setState(prevState => {
        return { timer: 0, seconds: 0, minutes: 0 };
      });
    }
  }

  private handleSoundChange(e: SoundChangeEvent) {
    this.song = e.newSound;
  }

  private playSound() {
    if (this.song !== SoundSelection.SilentSound) {
      const sound: Sound = Sounds.find(s => s.name === this.song)!;
      const howler = new Howl({ src: sound.path });
      howler.play();
    }
  }

  private calculateDisplayTime(timer: number) {
    const minutes = Math.floor(timer / 60);
    const seconds = timer - minutes * 60;
    const res = { seconds, minutes };
    return res;
  }

  private flashBackground() {
    this.container.style.background = this.isFlashed
      ? this.originalBackground
      : '#f44336';

    this.isFlashed = !this.isFlashed;
  }

  private updateOriginalBackground() {
    const style = window.getComputedStyle(this.container);
    this.originalBackground = style.background!;
  }

  private unlockSoundPlayback() {
    // https://github.com/goldfire/howler.js/#mobile-playback
    const src = Gong;
    const howler = new Howl({ src, volume: 0 });
    howler.play();
  }
}

export default App;
