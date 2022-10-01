import React from "react";
import _ from "lodash";
import { Field, useFormikContext } from "formik";

// This component conditionally wraps the provided component(HOC) in the HTML Element provided
const AddWrapperElement = ({ children, wrapperElement = React.Fragment }) => {
  const WrappingHTMLElement = wrapperElement;
  return <WrappingHTMLElement>{children}</WrappingHTMLElement>;
};

// This component conditionally maps through or displays the checkbox elements
function DisplaySingleOrMultipleCheckboxes({
  type,
  checkboxValue = { disabled: false },
  identifier,
  wrapperElement,
}) {
  const { values } = useFormikContext();
  const checkVal = _.get(values, identifier);

  const htmlValue = (currCheckboxValue, index = null) => (
    <AddWrapperElement wrapperElement={wrapperElement} key={index}>
      <label className="checkbox-item">
        <Field
          type="checkbox"
          name={identifier}
          value={currCheckboxValue.value}
          checked={checkVal?.includes(currCheckboxValue.value)}
          disabled={currCheckboxValue.disabled}
        />
        <span>{currCheckboxValue.name}</span>
      </label>
    </AddWrapperElement>
  );

  if (type === "single") {
    return htmlValue(checkboxValue);
  }

  if (type === "multiple") {
    return checkboxValue.map((singleCheckboxVal, index) =>
      htmlValue(singleCheckboxVal, index)
    );
  }
}
// this is using a formik checkbox: https://formik.org/docs/examples/checkboxes
const Checkboxes = ({ identifier, type, checkboxValue, wrapperElement }) => {
  return (
    <DisplaySingleOrMultipleCheckboxes
      identifier={identifier}
      checkboxValue={checkboxValue}
      type={type}
      wrapperElement={wrapperElement}
    />
  );
};

export default Checkboxes;

/* 
    EXAMPLES OF HOW THIS WORKS:
    the checkboxValue takes a string or an array. If you are using an array. the type should be: 
    type="multiple".
    If you are using a string. the type should be: 
    type="single".

    the wrapperElement prop is optional and will wrap the checkbox in the html element name provided

    checkboxes can also checked and/or false by default: checkboxValue={[ { name: 'Action/Adventure', checked: true, disabled: true} ]}

    How Single Checkboxes works:
    <Checkboxes
        identifier="genres"
        type="single"
        wrapperElement="li"
        checkboxValue={{ name: 'Action', value: "action"}} 
    />

    How multi Checkboxes works:

    <Checkboxes
        identifier="genres"
        type="multiple"
        wrapperElement="li"
        checkboxValue={[{ name: 'Action', value: "action"}, { name: 'anthropomorphic', value: "anthropomorphic" } 
    />

*/
