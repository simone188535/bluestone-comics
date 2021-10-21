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
    <section className="accordian">
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
              className="accordian-trigger"
              type="button"
              onClick={() => toggle(index)}
            >
              <h3 className="accordian-header">{items.question}</h3>
              <span className="accordian-icon">{accordianIcon}</span>
            </button>
            {revealAnwsers}
          </>
        );
      })}
    </section>
  );
};
export default Accordian;
