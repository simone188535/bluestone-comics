import React, { useEffect, useState } from "react";
import "./read.scss";

const Read = () => {
  const [pages, setPages] = useState([]);
  useEffect(() => {}, []);
  return (
    <div className="container-fluid read-page">
      <div className="row">
        <h2>Read</h2>
      </div>
    </div>
  );
};
export default Read;
