import * as React from "react";
import KeyCode from "../lib/KeyCode";
import BrowserUtils from "../lib/BrowserUtils";

import "./TimeboxEventEmitter.scss";

export interface TimeboxEventEmitterProps {
  onTimeboxToggle(): void;
  onTimeboxClick(): void;
}

class TimeboxEventEmitter extends React.Component<TimeboxEventEmitterProps> {
  public render() {
    return (
      <div
        className="timebox-event-emitter"
        tabIndex={0}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
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
}

export default TimeboxEventEmitter;
