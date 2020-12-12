import React from 'react';
import { Field } from 'formik';


// This component conditionally wraps the provided component(HOC) in the HTML Element provided
const AddWrapperElement = ({ children, wrapperElement }) => {

    let WrappingHTMLElement = wrapperElement ? wrapperElement : React.Fragment; // fallback in case you dont want to wrap your components
    return <WrappingHTMLElement>{children}</WrappingHTMLElement>
};

// This component conditionally maps through or displays the checkbox elements
const DisplaySingleOrMultipleCheckboxes = ({ type, checkboxValue, identifier, wrapperElement }) => {

    const htmlValue = (checkboxValue, index = null ) => (
        <AddWrapperElement wrapperElement={wrapperElement} key={index}>
            <label className="checkbox-item">
                <Field type="checkbox" name={identifier} value={checkboxValue}/>
                <span>
                    {checkboxValue}
                </span>
            </label>
        </AddWrapperElement>
    );

    if (type === 'single') {

        return htmlValue(checkboxValue)

    } else if (type === 'multiple') {
        return checkboxValue.map((singleCheckboxVal, index) => htmlValue(singleCheckboxVal, index));
    }
}
// this is using a formik checkbox: https://formik.org/docs/examples/checkboxes
const Checkboxes = ({ identifier, type, checkboxValue, wrapperElement }) => {
    return (
        <DisplaySingleOrMultipleCheckboxes identifier={identifier} checkboxValue={checkboxValue} type={type} wrapperElement={wrapperElement} />
    );
}

export default Checkboxes;