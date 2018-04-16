import * as React from 'react';

import './Clock.css';

export interface ClockProps {
  seconds: number;
  minutes: number;
  isTimeboxStarted: boolean;
}

export default (props: ClockProps) => {
  const seconds = padLeft(props.seconds);
  const minutes = padLeft(props.minutes);
  return (
    <React.Fragment>
      <div className="clock-value-container">
        <div className="clock-style">{minutes}</div>
        {!props.isTimeboxStarted && <div className="clock-label">m</div>}
      </div>
      <div className="clock-style">:</div>
      <div className="clock-value-container">
        <div className="clock-style">{seconds}</div>
        {!props.isTimeboxStarted && <div className="clock-label">s</div>}
      </div>
    </React.Fragment>
  );

  function padLeft(value: number): string {
    const pad = '00';
    const str = '' + value;
    return pad.substring(0, pad.length - str.length) + str;
  }
};
