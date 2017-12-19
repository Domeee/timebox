import * as React from 'react';
import './CounterLabel.css';

export interface CounterLabelProps {
  initValue: number;
  maxValue: number;
}
export interface CounterLabelState {
  value: number;
}

class CounterLabel extends React.Component<
  CounterLabelProps,
  CounterLabelState
> {
  clientY: number;
  minValue: number = 0;
  constructor(props: CounterLabelProps) {
    super(props);
    this.state = {
      value: props.initValue
    };
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
  }
  // tslint:disable-next-line:no-any
  handleTouchStart(e: any) {
    // Calculate current y position to determine whether the current touch action is horizontal or vertical
    const changes = e.changedTouches;
    if (changes.length > 0) {
      const change = changes[0];
      this.clientY = change.clientY;
    }
  }
  // tslint:disable-next-line:no-any
  handleTouchMove(e: any) {
    const changes = e.changedTouches;
    if (changes.length > 0) {
      const change = changes[0];
      if (this.clientY > change.clientY) {
        if (this.state.value < this.props.maxValue) {
          // scroll up
          this.setState(prevState => {
            return { value: prevState.value + 1 };
          });
        }
      } else if (this.clientY < change.clientY) {
        if (this.state.value > this.minValue) {
          this.setState(prevState => {
            return { value: prevState.value - 1 };
          });
        }
      }
      this.clientY = change.clientY;
    }
  }
  render() {
    return (
      <div
        className="counter-label"
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
      >
        {this.state.value}
      </div>
    );
  }
}

export default CounterLabel;
