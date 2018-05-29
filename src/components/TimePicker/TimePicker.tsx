import * as React from 'react';
import TimePickerValue from './TimePickerValue';
import TimeboxChangeEvent, {
  TimeboxChangeEventType,
} from '../../lib/TimeboxChangeEvent';

import './TimePicker.css';

export interface TimePickerProps {
  onTimeboxChange(e: TimeboxChangeEvent): void;
}

export interface TimePickerState {
  minutes: number;
  seconds: number;
}

class TimePicker extends React.Component<TimePickerProps, TimePickerState> {
  private minuteValues: number[] = [];
  private secondValues: number[] = [];

  constructor(props: TimePickerProps) {
    super(props);

    this.state = {
      minutes: 0,
      seconds: 0,
    };

    for (let i = 0; i < 60; i++) {
      this.minuteValues.push(i);
    }

    for (let i = 0; i < 60; i += 5) {
      this.secondValues.push(i);
    }

    this.handleClick = this.handleClick.bind(this);
  }

  public render() {
    const minutes = this.minuteValues.map(v => {
      return (
        <TimePickerValue
          key={v}
          value={v}
          onClick={e => this.setState({ minutes: e })}
        />
      );
    });

    const seconds = this.secondValues.map(s => {
      return (
        <TimePickerValue
          key={s}
          value={s}
          onClick={e => this.setState({ seconds: e })}
        />
      );
    });

    return (
      <div className="time-picker-container">
        <div className="values-container">
          <div className="minutes-container">
            <div className="minutes-header">Minutes</div>
            <div className="values">{minutes}</div>
          </div>
          <div className="seconds-container">
            <div className="seconds-header">Seconds</div>
            <div className="values">{seconds}</div>
          </div>
        </div>
        <div className="footer-container">
          <button>Cancel</button>
          <button onClick={e => this.handleClick(e)}>Set</button>
        </div>
      </div>
    );
  }

  private handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    this.props.onTimeboxChange({
      unit: this.state.seconds + this.state.minutes * 60,
      type: TimeboxChangeEventType.INIT_UNIT,
    });
  }
}

export default TimePicker;
