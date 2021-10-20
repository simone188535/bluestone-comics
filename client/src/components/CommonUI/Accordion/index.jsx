import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Data } from "./Data";
import "./accordian.scss";

const Accordian = () => {
  const [clicked, setClicked] = useState(false);

  const currentAccordianSelected = (index) => clicked === index;

  const toggle = (index) => {
    if (currentAccordianSelected(index)) {
      // if clicked question is already active, then close it
      return setClicked(null);
    }

    return setClicked(index);
  };

  return (
    <div className="accordian">
      <div className="accordian-section">
        <div className="container">
          {Data.map((items, index) => {
            const accordianIcon = currentAccordianSelected(index) ? (
              <FontAwesomeIcon icon={faMinus} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faPlus} size="lg" />
            );

            const revealAnwsers = currentAccordianSelected(index) ? (
              <div className="dropdown">
                <p>{items.answer}</p>
              </div>
            ) : null;

            return (
              <>
                <button
                  className="wrap"
                  type="button"
                  onClick={() => toggle(index)}
                >
                  <h1>{items.question}</h1>
                  <span>{accordianIcon}</span>
                </button>
                {revealAnwsers}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Accordian;
