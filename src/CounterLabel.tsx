import * as React from 'react';

export interface CounterLabelProps {
  value: number;
}

export default (props: CounterLabelProps) => {
  return <div className="counter-label">{props.value}</div>;
};
