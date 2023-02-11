import React from "react";

const DropDown = ({ opt, value, disabled }) => (
  <option value={value} className="dropdown-btn" disabled={disabled}>
    {opt}
  </option>
);

export default DropDown;
