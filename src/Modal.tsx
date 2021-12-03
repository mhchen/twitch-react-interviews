import React from 'react';

export type ModalProps = {
  isOpen: boolean;
  close: () => void;
  confirm: () => void;
};

export default function Modal(props: ModalProps) {
  return (
    <>
      <div
        className="modal-overlay"
        hidden={!props.isOpen}
        onClick={props.close}
      />

      <div className="modal" role="alert" hidden={!props.isOpen}>
        <div className="modal__header">
          <button className="button--icon" onClick={props.close}>
            X
          </button>
        </div>
        <div className="modal__body">
          Click the button below to accept amazing offer!
        </div>
        <div className="modal__footer">
          <button className="button" onClick={props.confirm}>
            Accept offer
          </button>
        </div>
      </div>
    </>
  );
}
