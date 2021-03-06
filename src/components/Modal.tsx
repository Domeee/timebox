import * as React from "react";

import "./Modal.scss";

export interface ModalProps {
  children: JSX.Element;
  isVisible: boolean;
}

export default (props: ModalProps) => {
  return props.isVisible ? (
    <div className="timebox-modal">{props.children}</div>
  ) : null;
};
