import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, isOpen, onClose, className }) => {
  const providedClassNames = className || "";

  const modalMarkup = (
    <div className={`modal-wrapper ${providedClassNames}`}>
      <div onClick={onClose} aria-hidden="true" className="modal-backdrop">
        <div className="modal-box">{children}</div>
      </div>
    </div>
  );

  return isOpen
    ? createPortal(modalMarkup, document.getElementById("modal-root"))
    : null;
};

export default Modal;

/* 
    EXAMPLE OF HOW THIS WORKS

    From parent:
     const [modalIsOpen, setModalIsOpen] = useState(false);
     const toggleModal = () => setModalIsOpen(!modalIsOpen);

    
    <Modal isOpen={modalIsOpen} onClose={toggleModal} >
        <div>
            Some child element. Anything can go in here.
        </div>
    </Modal>
*/
