import * as React from 'react';
import SoundChangeEvent from '../lib/SoundChangeEvent';

import './SoundSelection.css';

export interface SoundSelectionState {
  sound: string;
}

export interface SoundSelectionProps {
  onSoundChange(e: SoundChangeEvent): void;
}

class SoundSelection extends React.Component<
  SoundSelectionProps,
  SoundSelectionState
> {
  public static DefaultSound = 'gong';
  public static SilentSound = 'silent';
  constructor(props: SoundSelectionProps) {
    super(props);
    this.state = { sound: SoundSelection.DefaultSound };
    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    return (
      <div className="sound-selection">
        <select
          name="sound"
          value={this.state.sound}
          onChange={this.handleChange}
        >
          <option value="silent">Sound OFF</option>
          <option value="gong">Gong</option>
          <option value="cometogether">Come together</option>
          <option value="getupstandup">Get up stand up</option>
        </select>
      </div>
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const target = e.target;
    const name = target.name;

    // I have to use any until fixed: https://github.com/Microsoft/TypeScript/issues/15534
    this.setState({
      [name]: target.value,
      // tslint:disable-next-line:no-any
    } as any);
    this.props.onSoundChange({ newSound: target.value });
  }
}

export default SoundSelection;
