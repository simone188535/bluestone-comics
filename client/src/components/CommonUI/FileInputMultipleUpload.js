import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileInputMultipleUpload = ({className}) => {
    const [files, setFiles] = useState([]);
    const providedClassNames = className ? className : '';
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} className={`file-input-multiple-upload-container ${providedClassNames}`}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    )
}

export default FileInputMultipleUpload;