import * as React from 'react';
import TimeboxEvent, { TimeboxEventType } from './TimeboxEvent';
import './TimeboxEventEmitter.css';

export interface TimeboxEventEmitterProps {
  onChange(e: TimeboxEvent): void;
}

class TimeboxEventEmitter extends React.Component<TimeboxEventEmitterProps> {
  private currentY: number;
  private minutesTouched: boolean;
  private currentStepY: number;
  constructor(props: TimeboxEventEmitterProps) {
    super(props);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
  }
  public render() {
    return (
      <div
        className="timebox-event-emitter"
        draggable={true}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onDragStart={this.handleDragStart}
        onDragOver={this.handleDragOver}
      >
        {this.props.children}
      </div>
    );
  }
  // tslint:disable-next-line:no-any
  private handleTouchStart(e: React.TouchEvent<HTMLElement>) {
    // Init y to current mouse position
    const changes = e.changedTouches;
    if (changes.length > 0) {
      const change = changes[0];
      this.currentY = change.clientY;
      this.currentStepY = change.clientY;
      this.minutesTouched = this.detectEntityTouched(change.clientX);
    }
  }
  // tslint:disable-next-line:no-any
  private handleTouchMove(e: React.TouchEvent<HTMLElement>) {
    // Prevent touch action (e.g. scrolling) on safari and older browsers
    e.preventDefault();
    const changes = e.changedTouches;
    if (changes.length > 0) {
      const change = changes[0];
      if (this.hasReachedStep(change.clientY)) {
        if (this.currentY > change.clientY) {
          if (this.minutesTouched) {
            this.props.onChange({ type: TimeboxEventType.INCREASE_MINUTES });
          } else {
            this.props.onChange({ type: TimeboxEventType.INCREASE_SECONDS });
          }
        } else if (this.currentY < change.clientY) {
          if (this.minutesTouched) {
            this.props.onChange({ type: TimeboxEventType.DECREASE_MINUTES });
          } else {
            this.props.onChange({ type: TimeboxEventType.DECREASE_SECONDS });
          }
        }
        this.currentY = change.clientY;
      }
    }
  }
  private handleDragStart(e: React.DragEvent<HTMLElement>) {
    this.currentY = e.clientY;
    this.currentStepY = e.clientY;
    this.minutesTouched = this.detectEntityTouched(e.clientX);

    // Disable the visual drag effect
    const ghost = document.createElement('span');
    e.dataTransfer.setDragImage(ghost, 0, 0);

    // Dummy drag data, else onDrag won't be called in FF
    e.dataTransfer.setData('text/plain', 'batman forever!');
  }
  private handleDragOver(e: React.DragEvent<HTMLElement>) {
    // onDrag does not provide any values for clientY
    // Provides results for clientY with less noise
    if (this.hasReachedStep(e.clientY)) {
      if (this.currentY > e.clientY) {
        if (this.minutesTouched) {
          this.props.onChange({ type: TimeboxEventType.INCREASE_MINUTES });
        } else {
          this.props.onChange({ type: TimeboxEventType.INCREASE_SECONDS });
        }
      } else if (this.currentY < e.clientY) {
        if (this.minutesTouched) {
          this.props.onChange({ type: TimeboxEventType.DECREASE_MINUTES });
        } else {
          this.props.onChange({ type: TimeboxEventType.DECREASE_SECONDS });
        }
      }
      this.currentY = e.clientY;
    }
  }
  private detectEntityTouched(clientX: number) {
    const viewportWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    return clientX < viewportWidth / 2;
  }
  private hasReachedStep(newY: number) {
    const distance = Math.abs(newY - this.currentStepY);
    const viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    const distanceFactor = distance / viewportHeight;
    const hasReachedStep = distanceFactor >= 0.03;
    if (hasReachedStep) {
      this.currentStepY = newY;
    }
    return hasReachedStep;
  }
}

export default TimeboxEventEmitter;
