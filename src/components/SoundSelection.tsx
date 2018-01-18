import * as React from 'react';
import SoundChangeEvent from '../lib/SoundChangeEvent';

import closeWhite from './close-white.svg';
import dropDownCaret from './dropdown-caret.svg';

import './SoundSelection.css';

export interface SoundSelectionProps {
  onSoundChange(e: SoundChangeEvent): void;
}

export interface SoundSelectionState {
  isOpen: boolean;
  sound: string;
}

class SoundSelection extends React.Component<
  SoundSelectionProps,
  SoundSelectionState
> {
  public static SilentSound = 'silent';
  public static DefaultSound = 'gong';
  private overlay: HTMLDivElement;
  private sounds = [
    { id: 0, name: 'silent', title: 'sound off' },
    { id: 1, name: 'gong', title: 'gong' },
    { id: 2, name: 'getupstandup', title: 'get up, stand up' },
    { id: 3, name: 'cometogether', title: 'come together' },
  ];
  constructor(props: SoundSelectionProps) {
    super(props);

    this.state = {
      isOpen: false,
      sound: SoundSelection.DefaultSound,
    };

    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    const soundItems = this.sounds.map(s => {
      return (
        <li key={s.name} className="sound-item">
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
    const sound = this.sounds.find(s => s.name === this.state.sound)!;
    return (
      <React.Fragment>
        <div className="sound-selection-toggle" onClick={this.toggleOverlay}>
          {sound.title}
          <img src={dropDownCaret} />
        </div>
        <div
          className="overlay"
          ref={o => {
            this.overlay = o!;
          }}
        >
          <div className="overlay-close-container">
            <img
              src={closeWhite}
              className="overlay-close"
              alt="Timebox Toggle"
              onClick={this.toggleOverlay}
            />
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

  private toggleOverlay() {
    this.overlay.style.height = this.state.isOpen ? '0' : '100%';
    this.setState({ isOpen: !this.state.isOpen });
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const name = target.name;

    // I have to use any until fixed: https://github.com/Microsoft/TypeScript/issues/15534
    this.setState({
      [name]: target.value,
      // tslint:disable-next-line:no-any
    } as any);
    this.props.onSoundChange({ newSound: target.value });
    this.toggleOverlay();
  }
}

export default SoundSelection;
