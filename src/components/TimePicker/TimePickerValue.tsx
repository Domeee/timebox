import * as React from "react";

import "./TimePickerValue.scss";

export interface TimePickerValueProps {
  value: number;
  isActive: boolean;
  onClick(value: number): void;
}

export default (props: TimePickerValueProps) => {
  function padLeft(value: number): string {
    const str = value + "";
    const pad = "00";
    return pad.substring(0, pad.length - str.length) + str;
  }

  const v = padLeft(props.value);

  return (
    <button
      onClick={e => {
        e.stopPropagation();
        props.onClick(props.value);
      }}
      className={
        props.isActive
          ? "button button-time-value active"
          : "button button-time-value"
      }
    >
      {v}
    </button>
  );
};
