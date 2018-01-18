import * as React from 'react';

import './Clock.css';

export interface ClockProps {
  seconds: number;
  minutes: number;
  hours: number;
  isTimeboxStarted: boolean;
}

export default (props: ClockProps) => {
  const seconds = padLeft(props.seconds);
  const minutes = padLeft(props.minutes);
  const hours = padLeft(props.hours);
  return (
    <React.Fragment>
      {(props.hours > 0 || !props.isTimeboxStarted) && (
        <React.Fragment>
          <div className="clock-value-container">
            <div className="clock-style">{hours}</div>
            {!props.isTimeboxStarted && <div className="clock-label">h</div>}
          </div>
          <div className="clock-style">:</div>
        </React.Fragment>
      )}
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
