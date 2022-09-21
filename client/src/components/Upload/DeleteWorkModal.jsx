import React, { useState } from "react";
// import { useHistory, useParams } from "react-router-dom";
import ErrMsg from "../CommonUI/ErrorMessage";
import Modal from "../CommonUI/Modal";

const DeleteWorkModal = ({
  deleteModalIsOpen,
  setDeleteModalIsOpen,
  deleteMethod,
}) => {
  const [deleteErr, setDeleteErr] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteHelper = (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      deleteMethod();
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
    <>
      {deleteModalIsOpen && (
        <Modal
          isOpen={deleteModalIsOpen}
          onClose={() => resetModal()}
          isCloseButtonPresent={deleteErr}
          className="delete-work-modal"
        >
          {!deleteErr ? (
            <div>
              <h2>
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
            {!deleteErr && (
              <>
                <button
                  type="button"
                  className="bsc-button action-btn transparent transparent-red prompt-btn"
                  disabled={deleting}
                  onClick={(e) => deleteHelper(e)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="bsc-button action-btn transparent transparent-blue"
                  disabled={deleting}
                  onClick={() => resetModal()}
                >
                  Cancel
                </button>
              </>
            )}
          </section>
        </Modal>
      )}
    </>
  );
};

export default DeleteWorkModal;
