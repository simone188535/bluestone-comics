import React, { useEffect, useState } from "react";
import "./error-message.scss";

const ErrorMessage = ({ errorStatus, MessageText, className = "" }) => {
  const [hasError, setHasError] = useState(errorStatus);

  useEffect(() => {
    setHasError(errorStatus);
  }, [errorStatus]);

  return (
    hasError && (
      <div className={`error-message ${className}`}>
        <div className="error-text-color">{MessageText}</div>
      </div>
    )
  );
};
export default ErrorMessage;
