import * as React from 'react';
import TimeboxEvent, { TimeboxEventType } from './TimeboxEvent';

export interface TimeboxEventEmitterProps {
  onChange(e: TimeboxEvent): void;
}

class TimeboxEventEmitter extends React.Component<TimeboxEventEmitterProps> {
  private clientY: number;
  private minutesTouched: boolean;
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
      this.minutesTouched = this.detectEntityTouched(change.clientX);
    }
  }
  // tslint:disable-next-line:no-any
  private handleTouchMove(e: any) {
    const changes = e.changedTouches;
    if (changes.length > 0) {
      const change = changes[0];
      if (this.clientY > change.clientY) {
        if (this.minutesTouched) {
          this.props.onChange({ type: TimeboxEventType.INCREASE_MINUTES });
        } else {
          this.props.onChange({ type: TimeboxEventType.INCREASE_SECONDS });
        }
      } else if (this.clientY < change.clientY) {
        if (this.minutesTouched) {
          this.props.onChange({ type: TimeboxEventType.DECREASE_MINUTES });
        } else {
          this.props.onChange({ type: TimeboxEventType.DECREASE_SECONDS });
        }
      }
      this.clientY = change.clientY;
    }
  }
  private detectEntityTouched(clientX: number) {
    const viewportWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    return clientX < viewportWidth / 2;
  }
}

export default TimeboxEventEmitter;
