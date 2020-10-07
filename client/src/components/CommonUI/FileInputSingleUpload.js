import React, { createRef, useState } from 'react';

/*
    This component is designed to be used with formik. Out of the box, formik does not support file inputs. so `setFieldValue` is needed
    to assign values for validation. Search here for more details: https://stackoverflow.com/questions/56149756/reactjs-how-to-handle-image-file-upload-with-formik
*/

const FileInputSingleUpload = ({setFieldValue, identifier, triggerText}) => {
    let fileInput = createRef();
    const [fileInputValue, setFileInputValue] = useState('No file selected');
    
    const fileInputOnChange = (event) => {
        const uploadedFile = event.currentTarget.files[0];
        setFieldValue({identifier}, uploadedFile);

        let uploadedFileName = (uploadedFile) ? uploadedFile.name : 'No file selected';
        setFileInputValue(uploadedFileName);
    }

    return (
        <div className="file-input-single-upload-container">
            <input ref={fileInput} id={identifier} className="file-input-single-upload-field" name={identifier} type="file" onChange={fileInputOnChange} />
            <label tabIndex="0" htmlFor={identifier} className="file-input-single-upload-trigger">{triggerText}</label>
            <div className="file-input-single-upload-name">{fileInputValue}</div>
        </div>
    );
}

export default FileInputSingleUpload;
