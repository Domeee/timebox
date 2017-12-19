import * as React from 'react';
import TimeboxEvent, { TimeboxEventType } from './TimeboxEvent';

export interface TimeboxEventEmitterProps {
  onChange(e: TimeboxEvent): void;
}

class TimeboxEventEmitter extends React.Component<TimeboxEventEmitterProps> {
  private clientY: number;
  constructor(props: TimeboxEventEmitterProps) {
    super(props);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }
  public render() {
    return (
      <div
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
      >
        {this.props.children}
      </div>
    );
  }
  // tslint:disable-next-line:no-any
  private handleTouchStart(e: any) {
    // Init y to current mouse position
    const changes = e.changedTouches;
    if (changes.length > 0) {
      const change = changes[0];
      this.clientY = change.clientY;
    }
  }
  // tslint:disable-next-line:no-any
  private handleTouchMove(e: any) {
    const changes = e.changedTouches;
    if (changes.length > 0) {
      const change = changes[0];
      if (this.clientY > change.clientY) {
        this.props.onChange({ type: TimeboxEventType.INCREASE_SECONDS });
        console.log('TimeboxEventType.INCREASE_SECONDS');
      } else if (this.clientY < change.clientY) {
        this.props.onChange({ type: TimeboxEventType.DECREASE_SECONDS });
        console.log('TimeboxEventType.DECREASE_SECONDS');
      }
      this.clientY = change.clientY;
    }
  }
}

export default TimeboxEventEmitter;
