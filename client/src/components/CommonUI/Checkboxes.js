import React, { useState, useCallback, useEffect } from "react";
import { Field } from 'formik';

const Checkboxes = ({ identifier, checkboxValues }) => {

    const mapCheckboxValues = () => {
        return (
            checkboxValues.map((checkboxValue, index) => (
                <label key={index}>
                    <Field type="checkbox" name={identifier} value={checkboxValue} />
                    <span>
                        {checkboxValue}
                    </span>
                </label>
            ))
        );
    }

    return (
        <div role="group" aria-labelledby="checkbox-group">
            {mapCheckboxValues()}
        </div>
    );
}

export default Checkboxes;