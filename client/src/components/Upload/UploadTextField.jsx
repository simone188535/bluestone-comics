import React from "react";
import { ErrorMessage, Field } from "formik";

// this input works for both text inputs and text areas
const UploadTextField = ({ as = "input", ...props }) => {
  // const [field] = useField({ ...props, type });
  const inputClass = as === "input" ? "form-item" : "form-textarea";

  // add type="text" if 'as' = input, this indicates the field is a text input
  const conditionalTextInputProp = as === "input" ? "text" : undefined;

  return (
    <>
      <Field
        className={`form-input ${inputClass}`}
        // {...field}
        {...props}
        as={as}
        type={conditionalTextInputProp}
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
