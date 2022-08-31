import React, { useEffect, useState } from "react";
import Modal from "../CommonUI/Modal";
import ProgressBar from "../CommonUI/ProgressBar";

const ModalStatusMessage = ({ errorMessage, uploadPercentage }) => {
  const [currentUploadPercentage, setCurrentUploadPercentage] =
    useState(uploadPercentage);

  useEffect(() => {
    setCurrentUploadPercentage(uploadPercentage);
  }, [uploadPercentage]);

  if (errorMessage) {
    return (
      <div className="error-message error-text-color modal-spacing-md-top">
        {errorMessage}
      </div>
    );
  }

  const progressMessage =
    currentUploadPercentage === 100
      ? "Upload was successful!"
      : "Still loading... Please wait.";

  return (
    <div className="success-text-color modal-spacing-md-top">
      {progressMessage}
    </div>
  );
};

const SubmissionProgressModal = ({
  modalIsOpen,
  toggleModal,
  errorMessage,
  uploadPercentage,
}) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onClose={toggleModal}
      doesModalBackDropClose={false}
    >
      <h2 className="modal-head">Upload Progress: </h2>
      <ProgressBar uploadPercentage={uploadPercentage} />
      <ModalStatusMessage
        errorMessage={errorMessage}
        uploadPercentage={uploadPercentage}
      />
    </Modal>
  );
};

export default SubmissionProgressModal;
