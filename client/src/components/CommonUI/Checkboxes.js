import React from 'react';
import { Field } from 'formik';


// This component conditionally wraps the provided component(HOC) in the HTML Element provided
const AddWrapperElement = ({ children, wrapperElement }) => {

    let WrappingHTMLElement = wrapperElement ? wrapperElement : React.Fragment; // fallback in case you dont want to wrap your components
    return <WrappingHTMLElement>{children}</WrappingHTMLElement>
};

// This component conditionally maps through or displays the checkbox elements
// example of checkboxValue prop with checked and false enabled: checkboxValue={[ { name: 'Action/Adventure', checked: true, disabled: true} ]}
const DisplaySingleOrMultipleCheckboxes = ({ type, checkboxValue = {checked: false, disabled: false}, identifier, wrapperElement }) => {
    
    const htmlValue = (checkboxValue, index = null ) => (
        <AddWrapperElement wrapperElement={wrapperElement} key={index}>
            <label className="checkbox-item">
                <Field type="checkbox" name={identifier} value={checkboxValue.name} checked={checkboxValue.checked} disabled={checkboxValue.disabled}/>
                <span>
                    {checkboxValue.name}
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