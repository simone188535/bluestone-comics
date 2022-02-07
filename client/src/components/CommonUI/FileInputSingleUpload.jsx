import React, { useState } from "react";
import { useFormikContext } from "formik";

/*
    This component is designed to be used with formik. Out of the box, formik does not support file inputs. so `setFieldValue` is needed
    to assign values for validation. Search here for more details: https://stackoverflow.com/questions/56149756/reactjs-how-to-handle-image-file-upload-with-formik
*/

const FileInputSingleUpload = ({ identifier, triggerText, className }) => {
  const [file, setFile] = useState(null);
  const { setFieldValue } = useFormikContext();
  const providedClassNames = className || "";

  const fileInputOnChange = (event) => {
    const uploadedFile = event.currentTarget.files[0];

    // if no file is uploaded do not update the state
    if (!uploadedFile) return false;

    setFile(uploadedFile);
    setFieldValue(identifier, uploadedFile);
  };

  return (
    <div className={`file-input-single-upload-container ${providedClassNames}`}>
      <input
        id={identifier}
        name={identifier}
        className="file-input-single-upload-field"
        type="file"
        onChange={fileInputOnChange}
      />
      <label
        tabIndex="0"
        htmlFor={identifier}
        className="file-input-single-upload-trigger"
      >
        {triggerText}
      </label>
      <div className="file-input-single-upload-name">
        {file ? file.name : "No file selected"}
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
