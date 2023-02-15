import React, { useState } from "react";
// import { useHistory, useParams } from "react-router-dom";
import ErrMsg from "../CommonUI/ErrorMessage";
import Modal from "../CommonUI/Modal";
import "../CommonUI/Modal/styles/delete-work-modal.scss";

const DeleteWorkModal = ({
  deleteModalIsOpen,
  setDeleteModalIsOpen,
  deleteMethod,
}) => {
  const [deleteErr, setDeleteErr] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteHelper = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      await deleteMethod();
    } catch (err) {
      setDeleteErr(true);
    }
    setDeleting(false);
    setDeleteModalIsOpen(false);
  };

  const resetModal = () => {
    setDeleteModalIsOpen(false);
    setDeleteErr(false);
    setDeleting(false);
  };

  return (
    deleteModalIsOpen && (
      <Modal
        isOpen={deleteModalIsOpen}
        onClose={() => resetModal()}
        isCloseButtonPresent={!deleting}
        className="delete-work-modal"
      >
        {!deleteErr ? (
          <div>
            <h2 className="delete-work-modal-header">
              <strong>
                {deleting
                  ? "Deleting...."
                  : "Are you sure that you want to permanently delete this work?"}
              </strong>
            </h2>
            {deleting && <p>This may take a while, please be patient.</p>}
          </div>
        ) : (
          <ErrMsg
            errorStatus={deleteErr}
            messageText="An Error occurred. Please try again later."
          />
        )}
        <section className="action-btn-container">
          {!deleteErr && !deleting && (
            <>
              <button
                type="button"
                className="bsc-button action-btn transparent transparent-blue"
                disabled={deleting}
                onClick={() => resetModal()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bsc-button action-btn transparent transparent-red prompt-btn"
                disabled={deleting}
                onClick={(e) => deleteHelper(e)}
              >
                Delete
              </button>
            </>
          )}
        </section>
      </Modal>
    )
  );
};

export default DeleteWorkModal;
