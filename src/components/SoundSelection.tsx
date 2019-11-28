import * as React from "react";
import SoundChangeEvent from "../lib/SoundChangeEvent";
import { Sound } from "./Sound";
import Sounds from "./Sounds";

import "./SoundSelection.scss";

export interface SoundSelectionProps {
  onSoundChange(e: SoundChangeEvent): void;
}

export interface SoundSelectionState {
  sound: string;
  sounds: Sound[];
}

class SoundSelection extends React.Component<
  SoundSelectionProps,
  SoundSelectionState
> {
  public static SilentSound = "silent";
  public static DefaultSound = "gong";
  private overlay: HTMLDivElement | undefined = undefined;

  constructor(props: SoundSelectionProps) {
    super(props);

    this.state = {
      sound: SoundSelection.DefaultSound,
      sounds: []
    };

    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    const soundItems = this.state.sounds.map(s => {
      return (
        <li key={s.name} className="sound-item color-focus">
          <input
            type="radio"
            name="sound"
            id={s.name}
            value={s.name}
            onChange={this.handleChange}
            checked={this.state.sound === s.name}
            className="sound-item-value"
          />
          <label htmlFor={s.name} className="sound-item-label">
            {s.title}
          </label>
        </li>
      );
    });
    const sound = Sounds.find(s => s.name === this.state.sound)!;
    return (
      <React.Fragment>
        <div className="sound-selection-toggle" onClick={this.handleClick}>
          {sound.title}
          <svg
            className="sound-selection-toggle-icon"
            viewBox="0 0 13 8"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
              transform="translate(-911.000000, -82.000000)"
            >
              <g transform="translate(693.000000, 64.000000)">
                <path
                  // tslint:disable-next-line:max-line-length
                  d="M221.652,16.152 L221.652,23.8836923 C221.652,24.0674585 221.393952,24.216 221.076,24.216 C220.758048,24.216 220.5,24.0674585 220.5,23.8836923 L220.5,15.9083077 C220.5,15.8727099 220.509683,15.8384339 220.527609,15.8063034 C220.509848,15.7357619 220.5,15.6578667 220.5,15.576 C220.5,15.258048 220.648542,15 220.832308,15 L228.807692,15 C228.991458,15 229.14,15.258048 229.14,15.576 C229.14,15.893952 228.991458,16.152 228.807692,16.152 L221.652,16.152 Z"
                  transform="translate(224.820000, 19.608000) rotate(-135.000000) translate(-224.820000, -19.608000) "
                />
              </g>
            </g>
          </svg>
        </div>
        <div
          className="overlay"
          ref={o => {
            this.overlay = o!;
          }}
          // Disable modal onClick
          onClick={e => e.stopPropagation()}
        >
          <div className="overlay-close-container">
            <svg
              className="overlay-close"
              onClick={this.handleClick}
              viewBox="0 0 36 36"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
                transform="translate(-494.000000, -85.000000)"
              >
                <g
                  transform="translate(494.000000, 85.000000)"
                  className="overlay-close-g"
                >
                  <path
                    // tslint:disable-next-line:max-line-length
                    d="M18,0 C8.07492857,0 0,8.07492857 0,18 C0,27.9250714 8.07492857,36 18,36 C27.9250714,36 36,27.9250714 36,18 C36,8.07492857 27.9250714,0 18,0 Z M18,34.7142857 C8.78335714,34.7142857 1.28571429,27.216 1.28571429,18 C1.28571429,8.784 8.78335714,1.28571429 18,1.28571429 C27.2166429,1.28571429 34.7142857,8.784 34.7142857,18 C34.7142857,27.216 27.2166429,34.7142857 18,34.7142857 Z"
                  />
                  <path
                    // tslint:disable-next-line:max-line-length
                    d="M25.7142857,17.3571429 L10.2857143,17.3571429 C9.93021429,17.3571429 9.64285714,17.6451429 9.64285714,18 C9.64285714,18.3548571 9.93021429,18.6428571 10.2857143,18.6428571 L25.7142857,18.6428571 C26.0697857,18.6428571 26.3571429,18.3548571 26.3571429,18 C26.3571429,17.6451429 26.0697857,17.3571429 25.7142857,17.3571429 Z"
                    transform="translate(18.000000, 18.000000) rotate(-45.000000) translate(-18.000000, -18.000000) "
                  />
                  <path
                    // tslint:disable-next-line:max-line-length
                    d="M25.7142857,17.3571429 L10.2857143,17.3571429 C9.93021429,17.3571429 9.64285714,17.6451429 9.64285714,18 C9.64285714,18.3548571 9.93021429,18.6428571 10.2857143,18.6428571 L25.7142857,18.6428571 C26.0697857,18.6428571 26.3571429,18.3548571 26.3571429,18 C26.3571429,17.6451429 26.0697857,17.3571429 25.7142857,17.3571429 Z"
                    transform="translate(18.000000, 18.000000) rotate(45.000000) translate(-18.000000, -18.000000) "
                  />
                </g>
              </g>
            </svg>
          </div>
          <div className="overlay-content">
            <form>
              <ul>{soundItems}</ul>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }

  public componentDidMount() {
    const host = window.location.hostname;
    const hostSounds = Sounds.filter(s => s.hosts.some((h: any) => h === host));
    this.setState({
      sounds: hostSounds
    });
  }

  private handleClick(e: React.MouseEvent<HTMLElement | SVGElement>) {
    e.stopPropagation();
    this.toggleOverlay();
  }

  private toggleOverlay() {
    if (this.overlay) {
      this.overlay.style.height =
        this.overlay.style.height === "100%" ? "0" : "100%";
    }
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const name = target.name;

    // I have to use any until fixed: https://github.com/Microsoft/TypeScript/issues/15534
    this.setState({
      [name]: target.value
    } as any);
    this.props.onSoundChange({ newSound: target.value });
    this.toggleOverlay();
  }
}

export default SoundSelection;
