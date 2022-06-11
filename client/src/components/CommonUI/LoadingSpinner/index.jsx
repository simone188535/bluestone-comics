import React, { useEffect, useState } from "react";
import "./loading-spinner.scss";

// Inspired By this loading spinner: https://codepen.io/lucascalazans/pen/rerKwE
const LoadingSpinner = ({
  loadingStatus,
  className = "",
  spinnerType = "large",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // TODO: this state is for a small loading spinner to be added later
  // const [typeOfSpinner, setTypeOfSpinner] = useState(spinnerType);

  useEffect(() => {
    setIsLoading(loadingStatus);
  }, [loadingStatus]);

  const hasLoadingText =
    spinnerType === "large" ? (
      <span className="loading-name">LOADING</span>
    ) : null;

  const circleSize = spinnerType === "small" ? "small" : "large";
  return (
    isLoading && (
      <div className={`loading-spinner ${circleSize} ${className}`}>
        <div className="loading-content">
          <div className="loading-circle" />
          {hasLoadingText}
        </div>
      </div>
    )
  );
};
export default LoadingSpinner;
