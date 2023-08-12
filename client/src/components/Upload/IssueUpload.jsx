import React from "react";
import { Field, ErrorMessage } from "formik";

import FileInputSingleUpload from "../CommonUI/FileInputSingleUpload";
import FileInputMultipleUpload from "../CommonUI/FileInputMultipleUpload";
import WorkCredits from "./WorkCredits";
import CONSTANTS from "../../utils/Constants";

const {
  IMAGE_UPLOAD_DIMENSIONS: {
    THUMBNAIL: { WIDTH: THUMBNAIL_WIDTH, HEIGHT: THUMBNAIL_HEIGHT },
    STANDARD_UPLOAD_SIZE: {
      WIDTH: UPLOAD_SIZE_WIDTH,
      HEIGHT: UPLOAD_SIZE_HEIGHT,
    },
  },
} = CONSTANTS;

const IssueUpload = ({
  issueCoverPhotoData = {
    identifier: "issueCoverPhoto",
    toBeRemovedField: null,
    hasPrevUploadedData: false,
  },
  multiFileUploadPrevData = {
    identifier: "issueAssets",
    toBeRemovedField: null,
    hasPrevUploadedData: false,
  },
}) => {
  return (
    <>
      <Field
        className="form-input form-item"
        name="issueTitle"
        type="text"
        placeholder="Issue Title"
        autoComplete="on"
      />
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name="issueTitle"
      />
      <FileInputSingleUpload
        identifier={issueCoverPhotoData.identifier}
        triggerText="Select Issue Thumbnail Photo"
        toBeRemovedField={issueCoverPhotoData.toBeRemovedField}
        hasPrevUploadedData={issueCoverPhotoData.hasPrevUploadedData}
      />
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name="issueCoverPhoto"
      />
      <div className="form-header-subtext">
        Thumbnail size must be:{" "}
        <strong>{`${THUMBNAIL_WIDTH}px x ${THUMBNAIL_HEIGHT}px`}</strong>
      </div>
      <Field
        className="form-input form-textarea"
        name="issueDescription"
        as="textarea"
        placeholder="Issue Description"
        autoComplete="on"
      />
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name="issueDescription"
      />
      <FileInputMultipleUpload
        identifier={multiFileUploadPrevData.identifier}
        dropzoneInnerText={`<div class="form-header-text"> Drag 'n' drop <strong>Issue Pages</strong> here, or click to select files.<br/>(Recommended file size: ${UPLOAD_SIZE_WIDTH}px x ${UPLOAD_SIZE_HEIGHT}px)<div>`}
        toBeRemovedField={multiFileUploadPrevData.toBeRemovedField}
        hasPrevUploadedData={multiFileUploadPrevData.hasPrevUploadedData}
      />
      <div className="form-header-text">
        Give <strong>Credits</strong> to yourself and any other existing users
        by selecting the role(s) they fulfilled while helping to create this
        Book/Issue:
      </div>
      <WorkCredits identifier="workCredits" />
      <div className="form-header-subtext">
        <strong>
          *Tip: There is no need to select every available field if you are the
          only creator. Selecting &ldquo;writer&ldquo; and &ldquo;artist&ldquo;
          will suffice. It may overcomplicate the search for users trying to
          view which primary roles were fulfilled later.
        </strong>
      </div>
    </>
  );
};
export default IssueUpload;
