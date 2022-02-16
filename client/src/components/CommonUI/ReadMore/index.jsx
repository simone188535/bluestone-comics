import React, { useState } from "react";
import "./read-more.scss";

const ReadMore = ({ content, maxStringLengthShown }) => {
  const [hidden, setHidden] = useState(true);

  // My be able to remove this: related to this bug: May need to clear filtered result when changing filterType
  if (!content) return <></>;

  const previewText = content.slice(0, maxStringLengthShown);
  const overflowText = content.slice(maxStringLengthShown);

  const ToggleHidden = () => {
    setHidden(!hidden);
  };

  const showReadMore = overflowText ? (
    <span className={`dots ${hidden ? `reveal` : `hide`}`}>
      ...
      <button
        type="button"
        className="bsc-button primary-link read-button "
        onClick={() => ToggleHidden()}
      >
        Read More
      </button>
    </span>
  ) : (
    ""
  );
  const showReadLess = !hidden ? (
    <button
      type="button"
      className="bsc-button primary-link read-button"
      onClick={() => ToggleHidden()}
    >
      Read Less
    </button>
  ) : (
    ""
  );

  return (
    <span className="read-more">
      {previewText}
      {showReadMore}
      <span className={`text-overflow ${hidden ? `hide` : `reveal`}`}>
        {overflowText}
      </span>
      {showReadLess}
    </span>
  );
};

export default ReadMore;
