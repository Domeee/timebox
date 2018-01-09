import * as React from 'react';
import TimeboxChangeEvent, {
  TimeboxChangeEventType,
} from '../lib/TimeboxChangeEvent';
import TimeboxUnit from '../lib/TimeboxUnit';
import KeyCode from '../lib/KeyCode';
import SwipeGesture from '../lib/SwipeGesture';
import SwipeAxis from '../lib/SwipeAxis';
import ThemeChangeEvent from '../lib/ThemeChangeEvent';

import './TimeboxEventEmitter.css';

export interface TimeboxEventEmitterProps {
  onTimeboxChange(e: TimeboxChangeEvent): void;
  onTimeboxToggle(): void;
  onThemeChange(e: ThemeChangeEvent): void;
}

class TimeboxEventEmitter extends React.Component<TimeboxEventEmitterProps> {
  private static SensitivityVertical = 0.03;
  private static SensitivityHorizontal = 0.1;
  private currentY: number;
  private currentX: number;
  private currentUnit: TimeboxUnit;
  private axis?: SwipeAxis;
  private gesture?: SwipeGesture;

  constructor(props: TimeboxEventEmitterProps) {
    super(props);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  public render() {
    return (
      <div
        className="timebox-event-emitter"
        draggable={true}
        tabIndex={0}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onTouchCancel={this.handleTouchCancel}
        onDragStart={this.handleDragStart}
        onDragOver={this.handleDragOver}
        onDragEnd={this.handleDragEnd}
        onKeyDown={this.handleKeyDown}
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
      this.currentX = change.clientX;
      this.currentY = change.clientY;
      this.currentUnit = this.getCurrentUnit(change.clientX);
    }
  }

  // tslint:disable-next-line:no-any
  private handleTouchMove(e: React.TouchEvent<HTMLElement>) {
    // Prevent touch action (e.g. scrolling) on safari and older browsers
    e.preventDefault();

    const changes = e.changedTouches;
    if (changes.length === 0) return;

    const change = changes[0];

    // The swipe axis is stored for the current touch session. A ChangeEvent
    // is only triggered for one swipe action (Swipe up/down OR Swipe right/left).
    // If both swipe gesture are detected, Swipe up/down wins.
    const { gesture, axis } = this.getSwipeGestureAndAxis(
      this.currentX,
      change.clientX,
      this.currentY,
      change.clientY
    );

    this.axis = this.axis || axis;

    if (this.axis === SwipeAxis.Vertical) {
      if (gesture === SwipeGesture.SwipeUp) {
        this.props.onTimeboxChange({
          type: TimeboxChangeEventType.INCREASE_UNIT,
          unit: this.currentUnit,
        });
        this.currentY = change.clientY;
      } else if (gesture === SwipeGesture.SwipeDown) {
        this.props.onTimeboxChange({
          type: TimeboxChangeEventType.DECREASE_UNIT,
          unit: this.currentUnit,
        });
        this.currentY = change.clientY;
      }
    } else if (
      this.axis === SwipeAxis.Horizontal &&
      (gesture === SwipeGesture.SwipeRight || SwipeGesture.SwipeLeft)
    ) {
      this.gesture = gesture;
    }
  }

  private handleTouchEnd(e: React.TouchEvent<HTMLElement>) {
    this.handleSwipeSessionEnd();
  }

  private handleTouchCancel(e: React.TouchEvent<HTMLElement>) {
    this.cleanupSwipeSession();
  }

  private handleDragStart(e: React.DragEvent<HTMLElement>) {
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    this.currentUnit = this.getCurrentUnit(e.clientX);

    // Disable the visual drag effect
    const ghost = document.createElement('span');
    e.dataTransfer.setDragImage(ghost, 0, 0);

    // Dummy drag data, else onDrag won't be called in FF
    e.dataTransfer.setData('text/plain', 'batman forever!');
  }

  // onDrag does not provide any values for clientY
  // Provides results for clientY with less noise
  private handleDragOver(e: React.DragEvent<HTMLElement>) {
    // The swipe axis is stored for the current touch session. A ChangeEvent
    // is only triggered for one swipe action (Swipe up/down OR Swipe right/left).
    // If both swipe gesture are detected, Swipe up/down wins.
    const { gesture, axis } = this.getSwipeGestureAndAxis(
      this.currentX,
      e.clientX,
      this.currentY,
      e.clientY
    );

    this.axis = this.axis || axis;

    if (this.axis === SwipeAxis.Vertical) {
      if (gesture === SwipeGesture.SwipeUp) {
        this.props.onTimeboxChange({
          type: TimeboxChangeEventType.INCREASE_UNIT,
          unit: this.currentUnit,
        });
        this.currentY = e.clientY;
      } else if (gesture === SwipeGesture.SwipeDown) {
        this.props.onTimeboxChange({
          type: TimeboxChangeEventType.DECREASE_UNIT,
          unit: this.currentUnit,
        });
        this.currentY = e.clientY;
      }
    } else if (
      this.axis === SwipeAxis.Horizontal &&
      (gesture === SwipeGesture.SwipeRight || SwipeGesture.SwipeLeft)
    ) {
      this.gesture = gesture;
    }
  }

  private handleDragEnd(e: React.DragEvent<HTMLElement>) {
    this.handleSwipeSessionEnd();
  }

  private handleSwipeSessionEnd() {
    if (this.axis === SwipeAxis.Horizontal) {
      if (this.gesture === SwipeGesture.SwipeRight) {
        this.props.onThemeChange({ next: true });
      } else if (this.gesture === SwipeGesture.SwipeLeft) {
        this.props.onThemeChange({ next: false });
      }
    }
    this.cleanupSwipeSession();
  }

  private cleanupSwipeSession() {
    this.axis = undefined;
    this.gesture = undefined;
  }

  private handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.keyCode === KeyCode.SPACE) {
      this.props.onTimeboxToggle();
    }
  }

  private getCurrentUnit(clientX: number): TimeboxUnit {
    const viewportWidth = this.getViewportWidth();

    const hoursViewPortEnd = viewportWidth / 3;
    const secondsViewPortStart = viewportWidth / 3 * 2;
    const isHoursViewPort = clientX <= hoursViewPortEnd;
    const isSecondsViewPort = clientX > secondsViewPortStart;

    let unit: TimeboxUnit = TimeboxUnit.MINUTES;

    if (isHoursViewPort) {
      unit = TimeboxUnit.HOURS;
    } else if (isSecondsViewPort) {
      unit = TimeboxUnit.SECONDS;
    }

    return unit;
  }

  private getSwipeGestureAndAxis(
    oldPositionX: number,
    newPositionX: number,
    oldPositionY: number,
    newPositionY: number
  ) {
    const viewportX = this.getViewportHeight();
    const viewportY = this.getViewportWidth();
    const swipedHorizontal = this.hasReachedStep(
      oldPositionX,
      newPositionX,
      TimeboxEventEmitter.SensitivityHorizontal,
      viewportX
    );
    const swipedVertical = this.hasReachedStep(
      oldPositionY,
      newPositionY,
      TimeboxEventEmitter.SensitivityVertical,
      viewportY
    );

    let gesture;
    let axis;

    // Favor vertical swipe over horizontal
    if (swipedVertical) {
      axis = SwipeAxis.Vertical;
      if (oldPositionY > newPositionY) {
        gesture = SwipeGesture.SwipeUp;
      } else if (oldPositionY < newPositionY) {
        gesture = SwipeGesture.SwipeDown;
      }
    } else if (swipedHorizontal) {
      axis = SwipeAxis.Horizontal;
      if (oldPositionX > newPositionX) {
        gesture = SwipeGesture.SwipeLeft;
      } else if (oldPositionX < newPositionX) {
        gesture = SwipeGesture.SwipeRight;
      }
    }

    return { gesture, axis };
  }

  private hasReachedStep(
    oldPosition: number,
    newPosition: number,
    threshold: number,
    viewPort: number
  ) {
    const distance = Math.abs(newPosition - oldPosition);
    const distanceFactor = distance / viewPort;
    const hasReachedStep = distanceFactor >= threshold;
    return hasReachedStep;
  }

  private getViewportHeight() {
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  }

  private getViewportWidth() {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }
}

export default TimeboxEventEmitter;
