import React from "react";
import { Field } from "formik";

const RadioBtn = ({ fieldName, opt, value }) => (
  <label key={`radio-btn-type-${opt}`} className="radio-btn-label">
    <Field name={fieldName} value={value} type="radio" className="radio-btn" />
    {opt}
  </label>
);

export default RadioBtn;
