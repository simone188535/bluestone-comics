import React from 'react';
import { Field } from 'formik';

const Checkboxes = ({ setFieldValue, identifier, checkboxValues, className }) => {
    const providedClassNames = className ? className : '';

    const mapCheckboxValues = () => {
        return (
            checkboxValues.map((checkboxValue, index) => (
                <li key={index}>
                    <label>
                        <Field type="checkbox" name={identifier} value={checkboxValue} />
                        <span>
                            {checkboxValue}
                        </span>
                    </label>
                </li>
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