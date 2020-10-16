import React, { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";

const FileInputMultipleUpload = ({ setFieldValue, identifier, className }) => {
    const [files, setFiles] = useState([]);
    const providedClassNames = className ? className : '';
    // const onDrop = useCallback(acceptedFiles => {
    //     // Do something with the files
    // }, [])

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles,
        fileRejections
    } = useDropzone({ accept: 'image/*' })

    const acceptedFileItems = acceptedFiles.map(file => {
        console.log('acceptedFileItems', file);

        return (
            <li key={file.path}>
                {file.path} - {file.size} bytes
            </li>
        );
    });

    const fileRejectionItems = fileRejections.map(({ file, errors }) => {
        return (
            <li key={file.path}>
                {file.path} - {file.size} bytes
                <ul>
                    {errors.map(e => <li key={e.code}>{e.message}</li>)}
                </ul>

            </li>
        )
    });

    const onReorder = () => {
        /*
        This will allow for drag and dropping capabilities in the preview section. 
        setFieldValue needs to be reset. when this occurs.
        */
    }
    const removalOnClick = () => {
        /* 
            This allows for deleteing images withing the preview section. 
            When the user selects an image to remove. setFieldValue needs to be reset.
        */
    }


    return (
        <>
            <div {...getRootProps()} className={`file-input-multiple-upload-container ${providedClassNames}`}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
            <div className="preview-container">
                <ul>
                    acceptedFileItems: {acceptedFileItems}
                </ul>
                <ul>
                    fileRejectionItems: {fileRejectionItems}
                </ul>
            </div>
        </>
    )
}

export default FileInputMultipleUpload;