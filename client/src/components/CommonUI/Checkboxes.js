import React, { useState, useCallback, useEffect } from "react";
// import { Field } from 'formik';

const Checkboxes = ({ checkboxValues }) => {

    // const mapCheckboxValues = () => {
    //     return (
    //         checkboxValues.map((checkboxValue) => (
    //             <label>
    //                 <Field type="checkbox" name="checked" value={checkboxValue} />
    //           {checkboxValue}                
    //           </label>
    //         )));
    // }

    return (
        <div role="group" aria-labelledby="checkbox-group">
            tesy
            {checkboxValues}
        </div>
    );
}

export default Checkboxes;