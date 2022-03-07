import React from "react";
import { useFormikContext } from "formik";

const FormikSubmissionStatus = ({ err, successMessage, errMsg }) => {
  const { submitCount, isSubmitting, isValid } = useFormikContext();
  if (submitCount > 0 && !isSubmitting && isValid) {
    if (err) {
      return (
        <div className="error-message error-text-color text-center">
          {errMsg || "Something went wrong. Please try again later."}
        </div>
      );
    }
    return <div className="text-blue text-center">{successMessage}</div>;
  }
  return "";
};

export default FormikSubmissionStatus;
