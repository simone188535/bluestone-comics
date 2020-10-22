import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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

    const onDragEnd = (result) => {
        /*
        This will allow for drag and dropping capabilities in the preview section. 
        setFieldValue needs to be reset. when this occurs.
        
        If you want to know how works, the drag and drop functionality was modelled after 
        this article: https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd/
        */

        // Preventing errors from dragging out of bounds
        if (!result.destination) return;

        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFiles(items);

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
                {/* <h4>Accepted files</h4>
                <ul>{acceptedFileItems}</ul> */}
                <h4>Rejected files</h4>
                <ul>{fileRejectionItems}</ul>
                <h4>Preview files</h4>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="thumb-nails">
                        {(provided) => (
                            <ul className="thumb-nails" {...provided.droppableProps} ref={provided.innerRef}>
                                {files.map((uploadedFile, index) => (
                                    // This maps the current file state and implements react-beautiful-dnd so that the images uploaded can be sorted in order
                                    <Draggable key={uploadedFile.name} draggableId={uploadedFile.name} index={index}>
                                        {(provided) => (
                                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                                <button className="thumb-nail-remove-icon">
                                                    <FontAwesomeIcon
                                                        icon={faTimes}
                                                        size="sm"
                                                    />
                                                </button>

                                                <img className="thumb-nail-img"
                                                    src={uploadedFile.preview}
                                                />

                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </>
    )
}

export default FileInputMultipleUpload;