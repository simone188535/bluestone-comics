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

        const activeClass = currentAccordianSelected(index) ? "active" : "";

        // this allows the item description to be <li> or <p> depending on whether the item description is an array or a string
        const checkDescriptionType = Array.isArray(items.description) ? (
          <ul className="accordian-list">
            {items.description.map((item) => (
              <li key={`accordian-list-item-${item.id}`}>{item.listItem}</li>
            ))}
          </ul>
        ) : (
          <p>{items.description}</p>
        );

        const revealDescription = currentAccordianSelected(index) ? (
          <div className="dropdown">{checkDescriptionType}</div>
        ) : null;

        return (
          <React.Fragment key={`accordian-trigger-${items.id}`}>
            <button
              className={`accordian-trigger ${activeClass}`}
              type="button"
              onClick={() => toggle(index)}
            >
              <h3 className="accordian-header">{items.header}</h3>
              <span className="accordian-icon">{accordianIcon}</span>
            </button>
            {revealDescription}
          </React.Fragment>
        );
      })}
    </section>
  );
};
export default Accordian;
