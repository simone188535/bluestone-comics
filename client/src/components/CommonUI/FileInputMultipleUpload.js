import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const FileInputMultipleUpload = ({ setFieldValue, dropzoneInnerText, identifier, className }) => {
    const [files, setFiles] = useState([]);
    const providedClassNames = className ? className : '';

    const onDrop = useCallback(acceptedFiles => {
        /* 
            the drag and drop functionality is modeled after this article: 
            https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd/
       */

        acceptedFiles.forEach((acceptedFile) => {
          // rename inserted files (to avoid duplicate keys in list item): https://github.com/react-dropzone/react-dropzone/issues/583#issuecomment-496458314
        const renamedAcceptedFile = new File([acceptedFile], `${new Date()}_${acceptedFile.name}`, { type: acceptedFile.type });
        
        Object.assign(renamedAcceptedFile, {
            preview: URL.createObjectURL(renamedAcceptedFile)
        });

        // this prevents the new files from overriding/erasing the old ones. Instead, new files are concatinated to the old ones in the hook
        setFiles(prevState => [renamedAcceptedFile, ...prevState]);
      });

    }, [])

    useEffect(() => {
        // This sets the formik form value to the files hook in the parent component when the files hook is updated
        setFieldValue(identifier, files);
    }, [files, identifier, setFieldValue])

    const {
        getRootProps,
        getInputProps,
        fileRejections
    } = useDropzone({ accept: 'image/*', onDrop })

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code} className="error-text-color">{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    const onDragEnd = (result) => {
        /*
        This will allow for drag and dropping capabilities in the preview section. 
        
        If you want to know how works, the drag and drop functionality was modelled after 
        this article: https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd/
        */

        // Preventing errors from dragging a list item out of bounds of draggable
        if (!result.destination) return;

        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFiles(items);
    }
    const removalOnClick = (e, currentElementIndex) => {
        /* 
            This allows for deleteing images withing the preview section. 
            When the user selects an image to remove.
        */

        // removes selected element from files hook and sets updated file to the hook

        const items = Array.from(files);

        items.splice(currentElementIndex, 1);

        setFiles(items);
        e.stopPropagation();
    }


    return (
        <>
            <div {...getRootProps()} className={`file-input-multiple-upload-container ${providedClassNames}`}>
                <input {...getInputProps()} name={identifier}/>

                <p dangerouslySetInnerHTML={{ __html: dropzoneInnerText }}/>

            </div>
            <div className="file-input-multiple-upload-preview-container">

                {   // if there are any rejected files, show them
                    fileRejectionItems.length > 0 &&
                    (<>
                        <h4>Rejected files:</h4>
                        <ul>{fileRejectionItems}</ul>
                    </>)
                }

                {
                    // if there are any files uploaded, show them
                    files.length > 0 && (
                        <>
                            <h4>Preview Issue Assets: </h4>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="thumb-nails">
                                    {(provided) => (
                                        <ul className="thumb-nails" {...provided.droppableProps} ref={provided.innerRef}>
                                            {
                                                // This maps the current file state and implements react-beautiful-dnd so that the images uploaded can be sorted in order
                                                files.map((uploadedFile, index) => (
                                                    <Draggable key={uploadedFile.name} draggableId={uploadedFile.name} index={index}>
                                                        {(provided) => (
                                                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                                                <button
                                                                    className="thumb-nail-remove-icon"
                                                                    onClick={(e) => removalOnClick(e, index)}
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faTimes}
                                                                        size="sm"
                                                                    />
                                                                </button>
                                                                <p className="thumb-nail-caption">Page {index + 1}</p>
                                                                <img className="thumb-nail-img" 
                                                                    alt={uploadedFile.name}
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
                        </>
                    )}
            </div>
        </>
    )
}

export default FileInputMultipleUpload;