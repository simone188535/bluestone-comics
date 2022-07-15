import React, { useState, useEffect, useRef } from "react";
import { useFormikContext } from "formik";

/*
    This component is designed to be used with formik. Out of the box, formik does not support file inputs. so `setFieldValue` is needed
    to assign values for validation. Search here for more details: https://stackoverflow.com/questions/56149756/reactjs-how-to-handle-image-file-upload-with-formik
*/

const FileInputSingleUpload = ({
  identifier,
  triggerText,
  className,
  hasPrevUploadedData = false,
}) => {
  const ref = useRef();
  const [file, setFile] = useState(null);
  const { setFieldValue, values } = useFormikContext();
  const [prevDataIsLoaded, setPrevDataIsLoaded] = useState(false);
  const providedClassNames = className || "";

  useEffect(() => {
    /* 
    if the formik value that corresponding to this file input has no value. This file input and label should be set to have no value as well.
    This is useful for when the formik form using this component has been reset. In this case, the single file upload component in use should 
    also be reset.
    */
    let inputVal = ref.current.value;
    if (!values[identifier]) {
      if (inputVal) {
        inputVal = null;
        setFile(null);
      }
    } else {
      // add file if it is found within the formik context
      setFile(values[identifier]);
    }
  }, [identifier, values]);

  useEffect(() => {
    // if a file was previously uploaded, set the file upload value to the aws file string
    if (!prevDataIsLoaded && hasPrevUploadedData && file?.prevFile) {
      let currentInputValue = ref.current.value;
      if (!currentInputValue) {
        currentInputValue = file.prevFile;
        setPrevDataIsLoaded(true);
      }
    }
  }, [file, hasPrevUploadedData, prevDataIsLoaded]);

  const fileInputOnChange = (event) => {
    const uploadedFile = event.currentTarget.files[0];

    // if a file is uploaded update the state. Conversely, if no file is uploaded, unset state
    if (uploadedFile) {
      setFile(uploadedFile);
      setFieldValue(identifier, uploadedFile);
    } else {
      setFile(null);
      setFieldValue(identifier, null);
    }
  };

  return (
    <div className={`file-input-single-upload-container ${providedClassNames}`}>
      <input
        ref={ref}
        id={identifier}
        name={identifier}
        className="file-input-single-upload-field"
        type="file"
        onChange={fileInputOnChange}
      />
      <label htmlFor={identifier} className="file-input-single-upload-trigger">
        {triggerText}
      </label>
      <div className="file-input-single-upload-name">
        {file ? file.name || "Unknown File Name" : "No file selected"}
      </div>
    </div>
  );
};

export default FileInputSingleUpload;
/* 
    EXAMPLE OF HOW THIS WORKS:
    setFieldValue is a formik value.

    <FileInputSingleUpload identifier="bookCoverPhoto" triggerText="Select Book Cover Photo" />

*/
