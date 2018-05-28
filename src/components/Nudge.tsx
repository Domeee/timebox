import * as React from 'react';

import './Nudge.css';
import TimeboxChangeEvent, {
  TimeboxChangeEventType,
} from '../lib/TimeboxChangeEvent';

export interface NudgeProps {
  forward: boolean;
  unit: number;
  visible: boolean;
  onTimeboxChange(e: TimeboxChangeEvent): void;
}

export default (props: NudgeProps) => {
  const f = (
    <svg
      className="nudge"
      viewBox="0 0 44 48"
      onClick={e => {
        e.stopPropagation();
        props.onTimeboxChange({
          type: TimeboxChangeEventType.INCREASE_UNIT,
          unit: props.unit,
          nudge: true,
        });
      }}
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-858.000000, -452.000000)">
          <g transform="translate(848.000000, 446.000000)">
            <rect x="0" y="0" width="64" height="64" />
            <g
              strokeWidth="1"
              fillRule="evenodd"
              // tslint:disable-next-line:max-line-length
              transform="translate(31.833333, 29.333333) scale(-1, 1) translate(-31.833333, -29.333333) translate(10.333333, 5.333333)"
            >
              <path
                // tslint:disable-next-line:max-line-length
                d="M0,26.6666667 C0,38.4487413 9.55125867,48 21.3333333,48 C33.115408,48 42.6666667,38.4487413 42.6666667,26.6666667 C42.6666667,14.884592 33.115408,5.33333333 21.3333333,5.33333333"
                stroke="#000000"
                strokeWidth="1.33333333"
              />
              <polygon
                fill="#000000"
                transform="translate(18.000000, 5.333333) rotate(-90.000000) translate(-18.000000, -5.333333) "
                points="18 2 22.6666667 8.66666667 13.3333333 8.66666667"
              />
            </g>
            <text
              fontFamily="Roboto Condensed"
              fontSize="21"
              fontStyle="condensed"
              fontWeight="normal"
              letterSpacing="-0.300000012"
              fill="#000000"
            >
              <tspan x="21" y="39.1333415">
                1
              </tspan>
              <tspan x="31.0666992" y="39.1333415">
                5
              </tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>
  );

  const b = (
    <svg
      className="nudge"
      viewBox="0 0 44 48"
      onClick={e => {
        e.stopPropagation();
        props.onTimeboxChange({
          type: TimeboxChangeEventType.DECREASE_UNIT,
          unit: props.unit,
          nudge: true,
        });
      }}
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-778.000000, -452.000000)">
          <g transform="translate(768.000000, 446.000000)">
            <rect x="0" y="0" width="64" height="64" />
            <g
              strokeWidth="1"
              fillRule="evenodd"
              transform="translate(10.666667, 5.333333)"
            >
              <path
                // tslint:disable-next-line:max-line-length
                d="M0,26.6666667 C0,38.4487413 9.55125867,48 21.3333333,48 C33.115408,48 42.6666667,38.4487413 42.6666667,26.6666667 C42.6666667,14.884592 33.115408,5.33333333 21.3333333,5.33333333"
                id="Oval"
                stroke="#000000"
                strokeWidth="1.33333333"
              />
              <polygon
                fill="#000000"
                transform="translate(18.000000, 5.333333) rotate(-90.000000) translate(-18.000000, -5.333333) "
                points="18 2 22.6666667 8.66666667 13.3333333 8.66666667"
              />
            </g>
            <text
              fontFamily="Roboto Condensed"
              fontSize="21"
              fontStyle="condensed"
              fontWeight="normal"
              letterSpacing="-0.300000012"
              fill="#000000"
            >
              <tspan x="21" y="39.1333415">
                1
              </tspan>
              <tspan x="31.0666992" y="39.1333415">
                5
              </tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>
  );

  return props.visible ? (props.forward ? f : b) : null;
};
