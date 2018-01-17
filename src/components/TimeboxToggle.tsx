import * as React from 'react';
import playWhite from './play-white.svg';
import stopWhite from './stop-white.svg';

import './TimeboxToggle.css';

export interface TimeboxToggleProps {
  isTimeboxStarted: boolean;
  onTimeboxToggle(): void;
}

class TimeboxToggle extends React.Component<TimeboxToggleProps> {
  constructor(props: TimeboxToggleProps) {
    super(props);
    this.handleTimeboxToggle = this.handleTimeboxToggle.bind(this);
  }

  public render() {
    const svg = this.props.isTimeboxStarted ? stopWhite : playWhite;

    return (
      <div className="timebox-toggle">
        <img
          src={svg}
          className="timebox-toggle-icon"
          alt="Timebox Toggle"
          onClick={this.handleTimeboxToggle}
        />
      </div>
    );
  }

  private handleTimeboxToggle() {
    this.props.onTimeboxToggle();
  }
}

export default TimeboxToggle;
