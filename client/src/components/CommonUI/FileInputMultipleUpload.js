import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const FileInputMultipleUpload = ({ setFieldValue, identifier, className }) => {
    const [files, setFiles] = useState([]);
    const providedClassNames = className ? className : '';

    const onDrop = useCallback(acceptedFiles => {
        // setFiles(acceptedFiles.map(file => Object.assign(file, {
        //     preview: URL.createObjectURL(file)
        // })));
        acceptedFiles.map(acceptedFile => {
            Object.assign(acceptedFile, {
                preview: URL.createObjectURL(acceptedFile)
            });
            setFiles(prevState => [acceptedFile, ...prevState]);
        })
        // Do something with the files
    }, [])

    useEffect(() => {
        console.log('current hook files', files);
        // Make sure to revoke the data uris to avoid memory leaks
        // files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files])

    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        fileRejections
    } = useDropzone({ accept: 'image/*', onDrop })

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

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

                <p>Drop the files here ...</p>

            </div>
            <div className="file-input-multiple-upload-preview-container">
                <h4>Accepted files</h4>
                <ul>{acceptedFileItems}</ul>
                <h4>Rejected files</h4>
                <ul>{fileRejectionItems}</ul>
                <h4>Preview files</h4>
                    <ul className="thumb-nails">
                        {files.map(uploadedFile => (
                            <li key={uploadedFile.name}>
                                <img
                                    src={uploadedFile.preview}
                                />
                            </li>
                        )
                        )}
                    </ul>
            </div>
        </>
    )
}

export default FileInputMultipleUpload;