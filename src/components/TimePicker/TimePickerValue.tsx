import * as React from 'react';

import './TimePickerValue.css';

export interface TimePickerValueProps {
  value: number;
  onClick(value: number): void;
}

export default (props: TimePickerValueProps) => {
  function padLeft(value: number): string {
    const str = value + '';
    const pad = '00';
    return pad.substring(0, pad.length - str.length) + str;
  }

  const v = padLeft(props.value);

  return (
    <button
      onClick={e => {
        e.stopPropagation();
        props.onClick(props.value);
      }}
    >
      {v}
    </button>
  );
};
