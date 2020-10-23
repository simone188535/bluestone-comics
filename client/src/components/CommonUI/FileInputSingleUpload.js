import React, { useState, useEffect } from 'react';

/*
    This component is designed to be used with formik. Out of the box, formik does not support file inputs. so `setFieldValue` is needed
    to assign values for validation. Search here for more details: https://stackoverflow.com/questions/56149756/reactjs-how-to-handle-image-file-upload-with-formik
*/

const FileInputSingleUpload = ({ setFieldValue, identifier, triggerText, className }) => {
    const providedClassNames = className ? className : '';
    const [file, setFile] = useState(null);

    const fileInputOnChange = (event) => {
        const uploadedFile = event.currentTarget.files[0];

        // if no file is uploaded do not update the state
        if (!uploadedFile) return false;

        setFile(uploadedFile);
        setFieldValue(identifier, uploadedFile);
    }

    return (
        <div className={`file-input-single-upload-container ${providedClassNames}`}>
            <input id={identifier} className="file-input-single-upload-field" name={identifier} type="file" onChange={fileInputOnChange} />
            <label tabIndex="0" htmlFor={identifier} className="file-input-single-upload-trigger">{triggerText}</label>
            <div className="file-input-single-upload-name">{file ? file.name : 'No file selected'}</div>
        </div>
    );
}

export default FileInputSingleUpload;
