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
import Modal from './Modal';
import TimePicker from './TimePicker/TimePicker';

import './App.css';

export interface AppState {
  seconds: number;
  minutes: number;
  isTimeboxStarted: boolean;
  timer: number;
  theme: number;
  isModalVisible: boolean;
}

class App extends React.Component<{}, AppState> {
  private timeboxInterval: number;
  private flashBackgroundInterval: number;
  private song = SoundSelection.DefaultSound;
  private initialTheme: number;
  private themes = ['dark', 'blue', 'yellow', 'pink', 'purple', 'alarm'];
  // 5th position in themes array
  private alarmTheme = 5;

  constructor(props: {}) {
    super(props);
    this.state = {
      seconds: 0,
      minutes: 0,
      isTimeboxStarted: false,
      timer: 0,
      theme: 0,
      isModalVisible: false,
    };
    this.handleTimeboxChange = this.handleTimeboxChange.bind(this);
    this.handleTimeboxToggle = this.handleTimeboxToggle.bind(this);
    this.handleTimeboxTick = this.handleTimeboxTick.bind(this);
    this.handleSoundChange = this.handleSoundChange.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
    this.flashBackground = this.flashBackground.bind(this);
    this.handleTimeboxClick = this.handleTimeboxClick.bind(this);
  }

  public render() {
    const appClasses = `app ${this.themes[this.state.theme]}`;
    return (
      <div className={appClasses}>
        <TimeboxEventEmitter
          onTimeboxChange={this.handleTimeboxChange}
          onTimeboxToggle={this.handleTimeboxToggle}
          onThemeChange={this.handleThemeChange}
          onTimeboxClick={this.handleTimeboxClick}
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
            onClick={e => {
              e.stopPropagation();
              this.handleThemeChange({ next: true });
            }}
          />
          <Modal isVisible={this.state.isModalVisible}>
            <TimePicker
              onTimeboxChange={e => this.handleTimeboxChange(e)}
              minutes={this.state.minutes}
              seconds={this.state.seconds}
            />
          </Modal>
        </TimeboxEventEmitter>
      </div>
    );
  }

  public componentDidMount() {
    this.setInitialTheme();
  }

  private handleTimeboxChange(e: TimeboxChangeEvent) {
    // Ignore change for running timebox
    if (this.state.isTimeboxStarted && !e.nudge) return;

    // Ignore change if time left too short to decrease further
    if (
      this.state.timer < TimeboxUnit.SECONDS &&
      e.type === TimeboxChangeEventType.DECREASE_UNIT
    )
      return;

    this.setState(prevState => {
      let timer = 0;
      switch (e.type) {
        case TimeboxChangeEventType.DECREASE_UNIT:
          timer = prevState.timer - e.unit;
          break;
        case TimeboxChangeEventType.INCREASE_UNIT:
          timer = prevState.timer + e.unit;
          break;
        default:
          // TimeboxChangeEventType.INIT_UNIT
          timer = e.unit;
          break;
      }
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
      // Ignore alarm theme
      theme = theme < this.themes.length - 1 ? theme : 0;
    } else {
      theme = this.state.theme - 1;
      // Ignore alarm theme
      theme = theme >= 0 ? theme : this.themes.length - 2;
    }
    this.setInitialTheme(theme);
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
      // Stop the visual after 3 secs
      window.setTimeout(() => {
        window.clearInterval(this.flashBackgroundInterval);
        this.setState({
          theme: this.initialTheme,
        });
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
    this.setState(prevState => {
      const currentTheme =
        prevState.theme === this.alarmTheme
          ? this.initialTheme
          : this.alarmTheme;
      return { theme: currentTheme };
    });
  }

  private setInitialTheme(theme?: number) {
    // Null coalescing operator fails because theme can be 0
    // tslint:disable-next-line:prefer-conditional-expression
    if (theme !== undefined) {
      this.initialTheme = theme;
    } else {
      this.initialTheme = this.state.theme;
    }
  }

  private unlockSoundPlayback() {
    // https://github.com/goldfire/howler.js/#mobile-playback
    const src = Gong;
    const howler = new Howl({ src, volume: 0 });
    howler.play();
  }

  private handleTimeboxClick() {
    // Ignore change for running timebox
    if (this.state.isTimeboxStarted) return;

    this.setState(prevState => {
      return { isModalVisible: !prevState.isModalVisible };
    });
  }
}

export default App;
