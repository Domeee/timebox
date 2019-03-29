import * as React from "react";
import PickerColumn from "./PickerColumn";
import "./Picker.scss";

export interface PickerProps {
  valueGroups: { [index: string]: number };
  itemHeight: number;
  height: number;
  onChange(option: string, value: number): void;
  onClick(option: string, value: number): void;
}

export default (props: PickerProps) => {
  const style = {
    height: props.height
  };
  const { valueGroups, itemHeight, height, onChange, onClick } = props;
  const highlightStyle = {
    height: itemHeight,
    marginTop: -(itemHeight / 2)
  };
  const seconds = [];
  for (let i = 0; i < 60; i++) {
    seconds.push(i);
  }
  const minutes = [];
  for (let i = 0; i < 100; i++) {
    minutes.push(i);
  }
  return (
    <div className="picker-container" style={style}>
      <div className="picker-inner">
        <React.Fragment>
          <div className="picker-column-container">
            <PickerColumn
              name={"minutes"}
              options={minutes}
              value={valueGroups["minutes"]}
              itemHeight={itemHeight}
              columnHeight={height}
              onChange={onChange}
              onClick={onClick}
            />
            <div className="picker-label">m</div>
          </div>
          <div className="picker-column-container">
            <PickerColumn
              name={"seconds"}
              options={seconds}
              value={valueGroups["seconds"]}
              itemHeight={itemHeight}
              columnHeight={height}
              onChange={onChange}
              onClick={onClick}
            />
            <div className="picker-label">s</div>
          </div>
        </React.Fragment>
        <div className="picker-highlight" style={highlightStyle} />
      </div>
    </div>
  );
};
