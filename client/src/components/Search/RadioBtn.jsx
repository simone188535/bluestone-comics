import React from "react";
import { Field } from "formik";

const RadioBtn = ({ fieldName, opt, value, disabled }) => (
  <label key={`radio-btn-type-${opt}`} className="form-btn-label">
    <Field
      name={fieldName}
      value={value}
      type="radio"
      className="form-btn"
      disabled={disabled}
    />
    {opt}
  </label>
);

export default RadioBtn;
