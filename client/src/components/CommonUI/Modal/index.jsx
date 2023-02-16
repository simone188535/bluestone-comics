import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";

const Modal = ({
  className,
  children,
  isOpen,
  onClose,
  doesModalBackDropClose = true,
  isCloseButtonPresent = true,
}) => {
  const providedClassNames = className || "";

  const isModalBackDropCloseAvailable = doesModalBackDropClose ? onClose : null;

  const showModalCloseBtn = isCloseButtonPresent ? (
    <button type="button" className="modal-close-btn" onClick={onClose}>
      <FontAwesomeIcon icon={faTimes} size="lg" />
    </button>
  ) : null;

  const modalMarkup = (
    <div className={`modal-wrapper ${providedClassNames}`}>
      <div
        onClick={isModalBackDropCloseAvailable}
        aria-hidden="true"
        className="modal-backdrop"
      >
        <div className="modal-box">
          {showModalCloseBtn}
          {children}
        </div>
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
