import * as React from 'react';

import './Modal.css';

export interface ModalProps {
  children: JSX.Element;
  isVisible: boolean;
}

export default (props: ModalProps) => {
  return props.isVisible ? (
    <div className="timebox-modal">
      <h1>modal</h1>
      {props.children}
    </div>
  ) : null;
};
