import * as React from 'react';

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
    const play = (
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        transform="translate(-148.000000, -507.000000)"
      >
        <g transform="translate(148.000000, 507.000000)">
          <circle strokeWidth="4" cx="40" cy="40" r="38" />
          <polygon points="32 22 32 58 56 40" />
        </g>
      </g>
    );
    const stop = (
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        transform="translate(-148.000000, -505.000000)"
      >
        <g transform="translate(148.000000, 505.000000)">
          <circle strokeWidth="4" cx="40" cy="40" r="38" />
          <rect x="27" y="27" width="26" height="26" />
        </g>
      </g>
    );
    const svg = this.props.isTimeboxStarted ? stop : play;

    return (
      <svg
        className="timebox-toggle-icon"
        onClick={this.handleTimeboxToggle}
        viewBox="0 0 80 80"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {svg}
      </svg>
    );
  }

  private handleTimeboxToggle() {
    this.props.onTimeboxToggle();
  }
}

export default TimeboxToggle;
