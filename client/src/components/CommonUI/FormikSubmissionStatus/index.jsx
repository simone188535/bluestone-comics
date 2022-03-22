import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";

const FormikSubmissionStatus = ({
  err,
  successMessage,
  errMsg,
  removeSuccessAfterSetTime = null,
}) => {
  const [showSuccess, setShowSuccess] = useState(true);
  const { submitCount, isSubmitting, isValid } = useFormikContext();

  const afterSubmission = submitCount > 0 && !isSubmitting && isValid;

  useEffect(() => {
    // remove error message after seconds specified by the user ie removeSuccessAfterSetTime
    if (afterSubmission && successMessage && removeSuccessAfterSetTime) {
      setTimeout(() => {
        setShowSuccess(false);
      }, removeSuccessAfterSetTime);
    }
  }, [afterSubmission, removeSuccessAfterSetTime, successMessage]);

  if (afterSubmission) {
    if (err) {
      return (
        <div className="error-message error-text-color text-center">
          {errMsg || "Something went wrong. Please try again later."}
        </div>
      );
    }
    return (
      showSuccess && (
        <div className="text-blue text-center">{successMessage}</div>
      )
    );
  }
  return "";
};

export default FormikSubmissionStatus;
