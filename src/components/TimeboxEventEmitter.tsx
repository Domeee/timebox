import * as React from "react";
import KeyCode from "../lib/KeyCode";
import BrowserUtils from "../lib/BrowserUtils";
import TimeboxUnit from "../lib/TimeboxUnit";
import SwipeAxis from "../lib/SwipeAxis";
import SwipeGesture from "../lib/SwipeGesture";
import { TimeboxChangeEventType } from "../lib/TimeboxChangeEvent";
import ThemeChangeEvent from "../lib/ThemeChangeEvent";

import "./TimeboxEventEmitter.scss";

export interface TimeboxEventEmitterProps {
  onTimeboxToggle(): void;
  onTimeboxClick(): void;
  onThemeChange(e: ThemeChangeEvent): void;
}

class TimeboxEventEmitter extends React.Component<TimeboxEventEmitterProps> {
  private static SensitivityVertical = 0.03;
  private static SensitivityHorizontal = 0.1;
  private currentY: number = 0;
  private currentX: number = 0;
  private currentUnit: TimeboxUnit = TimeboxUnit.SECONDS;
  private axis?: SwipeAxis;
  private gesture?: SwipeGesture;

  public render() {
    return (
      <div
        className="timebox-event-emitter"
        tabIndex={0}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onTouchCancel={this.handleTouchCancel}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      >
        {this.props.children}
      </div>
    );
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.keyCode === KeyCode.SPACE) {
      e.preventDefault();
      this.props.onTimeboxToggle();
    }
  };

  private handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // Signaling click events only on non-touch devices
    if (BrowserUtils.hasTouch()) return;

    this.props.onTimeboxClick();
  };

  private handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    // Signaling touch events only on touch devices
    if (!BrowserUtils.hasTouch()) return;

    const changes = e.changedTouches;
    if (changes.length > 0) {
      const change = changes[0];
      this.currentX = change.clientX;
      this.currentY = change.clientY;
      this.currentUnit = this.getCurrentUnit(change.clientX);
    }
  };

  private handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    // Signaling touch events only on touch devices
    if (!BrowserUtils.hasTouch()) return;

    // Prevent touch action (e.g. scrolling) on safari and older browsers
    e.preventDefault();

    const changes = e.changedTouches;
    if (changes.length === 0) return;

    const change = changes[0];
    this.handleSwipeSession(change.clientX, change.clientY);
  };

  private handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    // Signaling touch events only on touch devices
    if (!BrowserUtils.hasTouch()) return;

    this.handleSwipeSessionEnd();
  };

  private handleTouchCancel = (e: React.TouchEvent<HTMLElement>) => {
    // Signaling touch events only on touch devices
    if (!BrowserUtils.hasTouch()) return;

    this.cleanupSwipeSession();
  };

  private handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Signaling touch events only on touch devices
    if (!BrowserUtils.hasTouch()) return;

    const trigger = e.buttons === undefined ? e.nativeEvent.which : e.buttons;
    if (trigger === 1) {
      this.handleSwipeSession(e.clientX, e.clientY);
    } else {
      this.currentX = e.clientX;
      this.currentY = e.clientY;
      this.currentUnit = this.getCurrentUnit(e.clientX);
    }
  };

  private handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    // Signaling touch events only on touch devices
    if (!BrowserUtils.hasTouch()) return;

    this.handleSwipeSessionEnd();
  };

  private handleSwipeSession(newPositionX: number, newPositionY: number) {
    // The swipe axis is stored for the current touch session. A ChangeEvent
    // is only triggered for one swipe action (Swipe up/down OR Swipe right/left).
    // If both swipe gesture are detected, Swipe up/down wins.
    const { gesture, axis } = this.getSwipeGestureAndAxis(
      this.currentX,
      newPositionX,
      this.currentY,
      newPositionY
    );

    this.axis = this.axis || axis;

    if (
      this.axis === SwipeAxis.Horizontal &&
      (gesture === SwipeGesture.SwipeRight || SwipeGesture.SwipeLeft)
    ) {
      this.gesture = gesture;
    }
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

  private getCurrentUnit(clientX: number): TimeboxUnit {
    const viewportWidth = this.getViewportWidth();

    const minutesViewPortEnd = viewportWidth / 2;
    const isSecondsViewPort = clientX > minutesViewPortEnd;

    let unit: TimeboxUnit = TimeboxUnit.MINUTES;

    if (isSecondsViewPort) {
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
        gesture = SwipeGesture.SwipeRight;
      } else if (oldPositionX < newPositionX) {
        gesture = SwipeGesture.SwipeLeft;
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
      document.documentElement!.clientHeight,
      window.innerHeight || 0
    );
  }

  private getViewportWidth() {
    return Math.max(
      document.documentElement!.clientWidth,
      window.innerWidth || 0
    );
  }
}

export default TimeboxEventEmitter;
