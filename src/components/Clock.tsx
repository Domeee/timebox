import * as React from "react";

import "./Clock.scss";

export interface ClockProps {
  seconds: number;
  minutes: number;
  hours: number;
  isTimeboxStarted: boolean;
}

export default (props: ClockProps) => {
  const seconds = padLeft(props.seconds);
  const minutes = padLeft(props.minutes);
  const labelSeconds = props.isTimeboxStarted ? <span>&nbsp;</span> : "s";
  const labelMinutes = props.isTimeboxStarted ? <span>&nbsp;</span> : "m";
  const labelHours = props.isTimeboxStarted ? <span>&nbsp;</span> : "h";
  return (
    <React.Fragment>
      {props.hours > 0 && (
        <React.Fragment>
          <div className="clock-value-container">
            <div className="clock-style">{props.hours}</div>
            <div className="clock-label">{labelHours}</div>
          </div>
          <div className="clock-value-container">
            <div className="clock-style-colon">:</div>
            <div className="clock-label">&nbsp;</div>
          </div>
        </React.Fragment>
      )}
      <div className="clock-value-container">
        <div className="clock-style">{minutes}</div>
        <div className="clock-label">{labelMinutes}</div>
      </div>
      <div className="clock-value-container">
        <div className="clock-style-colon">:</div>
        <div className="clock-label">&nbsp;</div>
      </div>
      <div className="clock-value-container">
        <div className="clock-style">{seconds}</div>
        <div className="clock-label">{labelSeconds}</div>
      </div>
    </React.Fragment>
  );

  function padLeft(value: number): string {
    const pad = "00";
    const str = "" + value;
    return pad.substring(0, pad.length - str.length) + str;
  }
};
