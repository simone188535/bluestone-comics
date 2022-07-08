import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useFormikContext } from "formik";
import {
  imageWidthAndHeight,
  isFileSizeTooLarge,
} from "../../../utils/FileReaderValidations";
import CONSTANTS from "../../../utils/Constants";

const { IMAGE_UPLOAD_DIMENSIONS } = CONSTANTS;

const DragnDrop = ({ files, onDragEnd, removalOnClick }) => {
  // This maps the current file state and implements react-beautiful-dnd so that the images uploaded can be sorted in order
  const draggableImageThumbnails = files.map((uploadedFile, index) => (
    <Draggable
      key={uploadedFile?.name || uploadedFile?.Metadata?.name}
      draggableId={uploadedFile.name || uploadedFile?.Metadata?.name}
      index={index}
    >
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <button
            type="button"
            className="thumb-nail-remove-icon"
            onClick={(e) => removalOnClick(e, index)}
          >
            <FontAwesomeIcon icon={faTimes} size="sm" />
          </button>
          <p className="thumb-nail-caption">Page {index + 1}</p>
          <img
            className="thumb-nail-img"
            alt={uploadedFile.name}
            src={uploadedFile.preview}
          />
          {console.log(uploadedFile)}
        </li>
      )}
    </Draggable>
  ));

  if (!files.length) return <></>;

  return (
    <>
      <h4>Preview Issue Assets: </h4>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="thumb-nails">
          {(provided) => (
            <ul
              className="thumb-nails"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {draggableImageThumbnails}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

const FileInputMultipleUpload = ({
  dropzoneInnerText,
  identifier,
  className,
  hasPrevUploadedData = false,
}) => {
  const [files, setFiles] = useState([]);
  const providedClassNames = className || "";
  const [prevDataIsLoaded, setPrevDataIsLoaded] = useState(false);
  const { setFieldValue, values } = useFormikContext();

  const getFilesFromEvent = async (event) => {
    const allFiles = [];
    const fileList = event.target.files;

    for (let i = 0; i < fileList.length; i += 1) {
      const file = fileList.item(i);
      // add width, and height properties to the current file
      if (file.width && file.height) return false;

      const imageDimensions = imageWidthAndHeight(file);
      file.width = imageDimensions.width;
      file.height = imageDimensions.height;

      allFiles.push(file);
    }

    await Promise.all(allFiles);
    return allFiles;
  };
  const validator = (providedFile) => {
    const { WIDTH, HEIGHT, MAX_FILE_SIZE, MAX_FILE_SIZE_IN_BYTES } =
      IMAGE_UPLOAD_DIMENSIONS.STANDARD_UPLOAD_SIZE;

    // validation 1. check width and height of file
    if (providedFile.width > WIDTH || providedFile.height > HEIGHT) {
      return {
        code: "file-dimensions-too-large",
        message: `This file is too large! The dimensions cannot be larger than the recommended file size: ${WIDTH} pixels x ${HEIGHT} pixels`,
      };
    }

    // validation 2. check if file size is too large / above 2MB
    if (isFileSizeTooLarge(providedFile, MAX_FILE_SIZE)) {
      return {
        code: "file-size-too-large",
        message: `This file is too large! The file size cannot be larger than: ${MAX_FILE_SIZE_IN_BYTES}`,
      };
    }
    return null;
  };
  const onDrop = useCallback((acceptedFiles) => {
    /* 
            the drag and drop functionality is modeled after this article: 
            https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd/
       */

    // REJECT FILES THAT ARE NOT THE CORRECT SIZE
    acceptedFiles.forEach((acceptedFile) => {
      // rename inserted files (to avoid duplicate keys in list item): https://github.com/react-dropzone/react-dropzone/issues/583#issuecomment-496458314
      const renamedAcceptedFile = new File(
        [acceptedFile],
        `${new Date()}_${acceptedFile.name}`,
        { type: acceptedFile.type }
      );

      Object.assign(renamedAcceptedFile, {
        preview: URL.createObjectURL(renamedAcceptedFile),
      });

      // this prevents the new files from overriding/erasing the old ones. Instead, new files are concatinated to the old ones in the hook
      setFiles((prevState) => [renamedAcceptedFile, ...prevState]);
    });
  }, []);

  useEffect(() => {
    // This sets the formik form value to the files hook in the parent component when the files hook is updated
    setFieldValue(identifier, files);
  }, [files, identifier, setFieldValue]);

  useEffect(() => {
    /*
      only on initial render, if files have previously existing files have been uploaded (when values[identifier] is populated), 
      add those files to the file state 
    */
    if (
      values[identifier]?.length > 0 &&
      !prevDataIsLoaded &&
      hasPrevUploadedData
    ) {
      console.log(": )");
      setFiles(values[identifier]);
      setPrevDataIsLoaded(true);
    }
  }, [hasPrevUploadedData, identifier, prevDataIsLoaded, values]);

  useEffect(() => {
    console.log('files', files);
  }, [files]);
  useEffect(() => {
    console.log('values', values[identifier]);
  }, [identifier, values]);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: "image/*",
    onDrop,
    validator,
    getFilesFromEvent,
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={`${file.name}-${file.lastModified}`}>
      {file.name} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li
            key={`${e.code}-${file.lastModified}`}
            className="error-text-color"
          >
            {e.message}
          </li>
        ))}
      </ul>
    </li>
  ));

  const fileRejection =
    fileRejectionItems.length > 0 ? (
      // if there are any rejected files, show them
      <>
        <h4>Rejected files:</h4>
        <ul>{fileRejectionItems}</ul>
      </>
    ) : null;

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
  };
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
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={`file-input-multiple-upload-container ${providedClassNames}`}
      >
        <input {...getInputProps()} name={identifier} />
        <p dangerouslySetInnerHTML={{ __html: dropzoneInnerText }} />
      </div>
      <div className="file-input-multiple-upload-preview-container">
        {fileRejection}
        <DragnDrop
          files={files}
          onDragEnd={onDragEnd}
          removalOnClick={removalOnClick}
        />
      </div>
    </>
  );
};

export default FileInputMultipleUpload;
/*
    EXAMPLES OF HOW THIS WORKS:
    setFieldValue is a formik value.

    <FileInputMultipleUpload identifier="issueAssets" dropzoneInnerText="Drag 'n' drop <strong>Issue Pages</strong> here, or click to select files" />


*/
