import * as React from 'react';

import './TimeboxToggle.css';

export interface TimeboxToggleProps {
  isTimeboxStarted: boolean;
  onTimeboxToggle(): void;
}

class TimeboxToggle extends React.Component<TimeboxToggleProps> {
  private play = (
    // tslint:disable-next-line:max-line-length
    <path d="M256,512C114.625,512,0,397.375,0,256C0,114.609,114.625,0,256,0s256,114.609,256,256C512,397.375,397.375,512,256,512z   M256,64C149.969,64,64,149.969,64,256s85.969,192,192,192c106.03,0,192-85.969,192-192S362.031,64,256,64z M192,160l160,96l-160,96  V160z" />
  );
  private stop = (
    // tslint:disable-next-line:max-line-length
    <path d="M256,512C114.625,512,0,397.375,0,256C0,114.609,114.625,0,256,0s256,114.609,256,256C512,397.375,397.375,512,256,512z   M256,64C149.969,64,64,149.969,64,256s85.969,192,192,192c106.03,0,192-85.969,192-192S362.031,64,256,64z M192,192h128v128H192  V192z" />
  );
  constructor(props: TimeboxToggleProps) {
    super(props);
    this.handleTimeboxToggle = this.handleTimeboxToggle.bind(this);
  }

  public render() {
    const path = this.props.isTimeboxStarted ? this.stop : this.play;

    return (
      <div className="timebox-toggle">
        <svg
          version="1.1"
          viewBox="0 0 600 600"
          onClick={this.handleTimeboxToggle}
        >
          {path}
        </svg>
      </div>
    );
  }

  private handleTimeboxToggle() {
    this.props.onTimeboxToggle();
  }
}

export default TimeboxToggle;
