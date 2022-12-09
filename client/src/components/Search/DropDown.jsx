import React from "react";

const DropDown = ({ opt, value }) => (
  <option value={value} className="dropdown-btn">
    {opt}
  </option>
);

export default DropDown;
