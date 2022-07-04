import React from "react";
import { ErrorMessage, Field } from "formik";

// this input works for both text inputs and text areas
const UploadTextField = ({ type = "input", ...props }) => {
  // const [field] = useField({ ...props, type });
  const inputClass = type === "input" ? "form-item" : "form-textarea";
  return (
    <>
      <Field
        className={`form-input ${inputClass}`}
        // {...field}
        {...props}
        as={type}
      />
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name={props.name}
      />
    </>
  );
};
export default UploadTextField;
