import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children, isOpen }) => {
    const [display, setDisplay] = useState(false);

    const toggleModalDisplay = () => {
        setDisplay(!display);
    }

    return (display ? createPortal(
        <div className="modal-wrapper">
            <div onClick={toggleModalDisplay} className="modal-backdrop" />
            <div className="modal-box">
                {children}
            </div>
        </div>, document.getElementById("modal-root"))
        : null);
}

export default Modal;