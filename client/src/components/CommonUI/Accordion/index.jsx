import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Data } from "./Data";
import "./accordian.scss";

const Accordian = ({ className }) => {
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
    <section className={`accordian ${className || ""}`}>
      {Data.map((items, index) => {
        const accordianIcon = currentAccordianSelected(index) ? (
          <FontAwesomeIcon icon={faMinus} size="lg" />
        ) : (
          <FontAwesomeIcon icon={faPlus} size="lg" />
        );

        const revealDescription = currentAccordianSelected(index) ? (
          <div className="dropdown">
            <p>{items.description}</p>
          </div>
        ) : null;

        const activeClass = currentAccordianSelected(index) ? "active" : "";

        return (
          <>
            <button
              className={`accordian-trigger ${activeClass}`}
              type="button"
              onClick={() => toggle(index)}
            >
              <h3 className="accordian-header">{items.header}</h3>
              <span className="accordian-icon">{accordianIcon}</span>
            </button>
            {revealDescription}
          </>
        );
      })}
    </section>
  );
};
export default Accordian;
