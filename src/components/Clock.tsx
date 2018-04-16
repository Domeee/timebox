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
  const labelSeconds = props.isTimeboxStarted ? <span>&nbsp;</span> : 's';
  const labelMinutes = props.isTimeboxStarted ? <span>&nbsp;</span> : 'm';
  return (
    <React.Fragment>
      <div className="clock-value-container">
        <div className="clock-style">{minutes}</div>
        <div className="clock-label">{labelMinutes}</div>
      </div>
      <div className="clock-style clock-style-colon">
        :
        <div className="clock-label">&nbsp;</div>
      </div>
      <div className="clock-value-container">
        <div className="clock-style">{seconds}</div>
        <div className="clock-label">{labelSeconds}</div>
      </div>
    </React.Fragment>
  );

  function padLeft(value: number): string {
    const pad = '00';
    const str = '' + value;
    return pad.substring(0, pad.length - str.length) + str;
  }
};
