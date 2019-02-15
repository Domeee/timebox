import * as React from "react";
import "./PickerItem.scss";

export interface PickerItemProps {
  option: number;
  value: number;
  itemHeight: number;
  onClick(option: number): void;
}

export default (props: PickerItemProps) => {
  const style = {
    height: `${props.itemHeight}px`,
    lineHeight: `${props.itemHeight}px`
  };

  const className = `picker-item${
    props.option === props.value ? " picker-item-selected" : ""
  }`;

  return (
    <div
      className={className}
      style={style}
      onClick={() => props.onClick(props.option)}
    >
      {props.option}
    </div>
  );
};
