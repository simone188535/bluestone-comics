import React from "react";
import { ErrorMessage, useField } from "formik";

// this input works for both text inputs and text areas
const UploadTextField = ({ type = "text", ...props }) => {
  const [field] = useField({ ...props, type });
  const inputClass = type === "text" ? "form-item" : "form-textarea";
  return (
    <>
      <input className={`form-input ${inputClass}`} {...field} {...props} />
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name={props.name}
      />
    </>
  );
};
export default UploadTextField;
