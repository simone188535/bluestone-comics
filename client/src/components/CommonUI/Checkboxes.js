import React from 'react';
import { Field } from 'formik';


// This component conditionally wraps the provided component(HOC) in the HTML Element provided
const AddWrapperElement = ({children, wrapperElement}) => {
    
    let WrappingHTMLElement = wrapperElement ? wrapperElement : React.Fragment; // fallback in case you dont want to wrap your components
    return <WrappingHTMLElement>{children}</WrappingHTMLElement>
};

// this is using a formik checkbox: https://formik.org/docs/examples/checkboxes
const Checkboxes = ({ identifier, type, checkboxValues, className, wrapperElement }) => {
    const providedClassNames = className ? className : '';
    
    const mapCheckboxValues = () => {
        return (
            checkboxValues.map((checkboxValue, index) => (
                
                <AddWrapperElement key={index} wrapperElement={wrapperElement}>
                    <label>
                        <Field type="checkbox" name={identifier} value={checkboxValue}/>
                        <span>
                            {checkboxValue}
                        </span>
                    </label>
                </AddWrapperElement>
            ))
        );
        
    }

    return (
        <ul className={`checkbox-group ${providedClassNames}`}>
            {mapCheckboxValues()}
        </ul>
    );
}

export default Checkboxes;