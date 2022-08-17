import React from "react";
import { Field, ErrorMessage } from "formik";

import Checkboxes from "../CommonUI/Checkboxes";
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
  issueCoverPhotoPrevExistingData = {
    toBeRemovedField: null,
    hasPrevUploadedData: false,
  },
  multiFileUploadPrevExistingData = {
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
        identifier="issueCoverPhoto"
        triggerText="Select Issue Thumbnail Photo"
        toBeRemovedField={issueCoverPhotoPrevExistingData.toBeRemovedField}
        hasPrevUploadedData={
          issueCoverPhotoPrevExistingData.hasPrevUploadedData
        }
      />
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name="issueCoverPhoto"
      />
      <div className="form-header-subtext">
        Thumbnail size must be:{" "}
        <strong>{`${THUMBNAIL_WIDTH} x ${THUMBNAIL_HEIGHT}`}</strong>
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
      <div className="form-header-text">
        Select the applicable <strong>genres</strong>
      </div>
      <ul className="checkbox-group upload-checkboxes">
        <Checkboxes
          identifier="genres"
          type="multiple"
          wrapperElement="li"
          checkboxValue={[
            { name: "Action/Adventure" },
            { name: "Anthropomorphic" },
            { name: "Children" },
            { name: "Comedy" },
            { name: "Crime" },
            { name: "Drama" },
            { name: "Family" },
            { name: "Fantasy" },
            { name: "Graphic Novels" },
            { name: "Historical" },
            { name: "Horror" },
            { name: "LGBTQ" },
            { name: "Mature" },
            { name: "Music" },
            { name: "Mystery" },
            { name: "Mythology" },
            { name: "Psychological" },
            { name: "Romance" },
            { name: "School Life" },
            { name: "Sci-Fi" },
            { name: "Slice of Life" },
            { name: "Sport" },
            { name: "Superhero" },
            { name: "Supernatural" },
            { name: "Thriller" },
            { name: "War" },
            { name: "Western" },
            { name: "Zombies" },
          ]}
        />
      </ul>
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name="genres"
      />
      <FileInputMultipleUpload
        identifier="issueAssets"
        dropzoneInnerText={`<div class="form-header-text"> Drag 'n' drop <strong>Issue Pages</strong> here, or click to select files.<br/>(Recommended file size: ${UPLOAD_SIZE_WIDTH} x ${UPLOAD_SIZE_HEIGHT})<div>`}
        toBeRemovedField={multiFileUploadPrevExistingData.toBeRemovedField}
        hasPrevUploadedData={
          multiFileUploadPrevExistingData.hasPrevUploadedData
        }
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
          only creator. Selecting writer and artist will suffice. It may
          overcomplicate the search for any of your other works.
        </strong>
      </div>
    </>
  );
};
export default IssueUpload;
