import React, { useEffect, useState } from "react";
import "./loading-spinner.scss";

// Inspired By this loading spinner: https://codepen.io/lucascalazans/pen/rerKwE
const LoadingSpinner = ({
  loadingStatus,
  className = "",
  // spinnerType
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // TODO: this state is for a small loading spinner to be added later
  // const [typeOfSpinner, setTypeOfSpinner] = useState(spinnerType);

  useEffect(() => {
    setIsLoading(loadingStatus);
  }, [loadingStatus]);

  return (
    isLoading && (
      <div className={`loading-spinner ${className}`}>
        <div className="loading-content">
          <div className="loading-circle" />
          <span className="loading-name">LOADING</span>
        </div>
      </div>
    )
  );
};
export default LoadingSpinner;
