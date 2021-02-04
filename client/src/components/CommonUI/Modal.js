import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children, isOpen, onClose, className }) => {
    
    const providedClassNames = className ? className : '';
    
    return (isOpen ? createPortal(
        <div className={`modal-wrapper ${providedClassNames}`}>
            <div onClick={onClose} className="modal-backdrop" />
            <div className="modal-box">
                {children}
            </div>
        </div>, document.getElementById("modal-root"))
        : null);
}

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