import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children, isOpen, onClose }) => {

    return (isOpen ? createPortal(
        <div className="modal-wrapper">
            <div onClick={onClose} className="modal-backdrop" />
            <div className="modal-box">
                {children}
            </div>
        </div>, document.getElementById("modal-root"))
        : null);
}

export default Modal;