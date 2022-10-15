import React, { memo } from "react";
import slugify from "slugify";
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  useField,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import FileInputSingleUpload from "../CommonUI/FileInputSingleUpload";
import FileInputMultipleUpload from "../CommonUI/FileInputMultipleUpload";
import Checkboxes from "../CommonUI/Checkboxes";
import Modal from "../CommonUI/Modal";
import ProgressBar from "../CommonUI/ProgressBar";
import WorkCredits from "./WorkCredits";
import {
  // eslint-disable-next-line no-unused-vars
  imageDimensionCheck,
  // eslint-disable-next-line no-unused-vars
  imageSizeCheck,
} from "../../utils/Yup/yupCustomMethods";
import CONSTANTS from "../../utils/Constants";
import "./upload.scss";

const { IMAGE_UPLOAD_DIMENSIONS } = CONSTANTS;

const { WIDTH, HEIGHT, MAX_FILE_SIZE, MAX_FILE_SIZE_IN_BYTES } =
  IMAGE_UPLOAD_DIMENSIONS.THUMBNAIL;
// MAKE THIS REUSABLE FOR BOOKS AND ISSUE UPDATES
const UrlSlugifedField = (props) => {
  /*
        The default value of this field is dependent on the value of the book title field. The user
        is still able to customize it though.
    */
  const {
    values: { bookTitle },
    setFieldValue,
  } = useFormikContext();
  const [field] = useField(props);

  React.useEffect(() => {
    setFieldValue(props.name, slugify(bookTitle));
    // eslint-disable-next-line react/destructuring-assignment
  }, [bookTitle, setFieldValue, props.name]);

  return (
    <>
      <input {...props} {...field} />
    </>
  );
};

const UploadBookFields = ({ values, errors, defaultSelectedUsernames }) => {
  const workCreditsErrorMessage = (WCErrors) =>
    /*
            This has been added because we are using a Field Array Validation within the WorkCredits Component.
            In order to display the outer error message for this array of objects, this conditional is needed.
            More info here: https://formik.org/docs/api/fieldarray#fieldarray-validation-gotchas
        */
    typeof WCErrors.workCredits === "string" ? (
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name="workCredits"
      />
    ) : null;

  const multiFileUploadErrorMessage = (MFErrors) => {
    /*
            This has been added so that only a single message will be shown in FileInputMultipleUpload at all times.
            Even when an array of error are show (when a multiple uploaded files fail validation)
        */
    let FileInputMultipleUploadErrorMsg;

    if (typeof MFErrors.issueAssets === "string") {
      FileInputMultipleUploadErrorMsg = (
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="issueAssets"
        />
      );
    } else if (Array.isArray(MFErrors.issueAssets)) {
      FileInputMultipleUploadErrorMsg = (
        <div className="error-message error-text-color">
          {MFErrors?.issueAssets[0]}
        </div>
      );
    } else {
      FileInputMultipleUploadErrorMsg = null;
    }
    return FileInputMultipleUploadErrorMsg;
  };

  return (
    <Form
      className="bsc-form upload-form"
      encType="multipart/form-data"
      method="post"
    >
      <h1 className="form-header-text">
        Upload a <strong>New Book</strong> along with its{" "}
        <strong>First Issue</strong>
      </h1>
      <div>
        <Field
          className="form-input form-item"
          name="bookTitle"
          type="text"
          placeholder="Book Title"
          autoComplete="on"
        />
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="bookTitle"
        />
        <FileInputSingleUpload
          identifier="bookCoverPhoto"
          triggerText="Select Book Thumbnail Photo"
        />
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="bookCoverPhoto"
        />
        <div className="form-header-subtext">
          Thumbnail size must be: <strong>{`${WIDTH} x ${HEIGHT}`}</strong>
        </div>
        <Field
          className="form-input form-textarea"
          name="bookDescription"
          as="textarea"
          placeholder="Book Description"
          autoComplete="on"
        />
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="bookDescription"
        />
        <UrlSlugifedField
          className="form-input form-item slug-field"
          name="urlSlug"
          type="text"
          placeholder="URL Slug"
          autoComplete="on"
        />
        <div className="form-header-subtext">
          <strong>Your Comic URL will be similar to this: </strong>{" "}
          https://bluestonecomics.com/api/v1/read/
          <strong>{values.urlSlug ? values.urlSlug : "<URL Slug>"}</strong>
          /book/1234
        </div>
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="urlSlug"
        />
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
        />
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="issueCoverPhoto"
        />
        <div className="form-header-subtext">
          Thumbnail size must be: <strong>{`${WIDTH} x ${HEIGHT}`}</strong>
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
          dropzoneInnerText={`<div class="form-header-text"> Drag 'n' drop <strong>Issue Pages</strong> here, or click to select files.<br/>(Recommended file size: ${IMAGE_UPLOAD_DIMENSIONS.STANDARD_UPLOAD_SIZE.WIDTH} x ${IMAGE_UPLOAD_DIMENSIONS.STANDARD_UPLOAD_SIZE.HEIGHT})<div>`}
        />
        {/*
        <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name="issueAssets" />
        */}
        {multiFileUploadErrorMessage(errors)}
        {/*
        <div className="form-header-text">
        Assign <strong>Work Credits</strong>
        for yourself and any existing users who helped create this issue:
        </div> */}
        <div className="form-header-text">
          Give <strong>Credits</strong> to yourself and any other existing users
          by selecting the role(s) they fulfilled while helping to create this
          Book/Issue:
        </div>
        <WorkCredits
          identifier="workCredits"
          defaultSelectedUsernames={defaultSelectedUsernames}
        />
        {workCreditsErrorMessage(errors)}
        <div className="form-header-subtext">
          <strong>
            *Tip: There is no need to select every available field if you are
            the only creator. Selecting writer and artist will suffice. It may
            overcomplicate the search for any of your other works.
          </strong>
        </div>
      </div>
      <button type="submit" className="form-submit form-item">
        Submit
      </button>
      {/* This is being left for testing purposes. Example found in this video:
      https://www.youtube.com/watch?v=Dm0TXbGvgvo&t=142s
      <pre>{JSON.stringify(errors, null, 2)}</pre>
      <pre>{JSON.stringify(values, null, 2)}</pre> */}
    </Form>
  );
};

const UploadTemplate = ({
  onSubmit,
  initialValues,
  toggleModal,
  uploadPercentage,
  modalIsOpen,
  errorMessage,
  currentUsername,
}) => {
  const ModalStatusMessage = () => {
    if (errorMessage) {
      return (
        <div className="error-message error-text-color modal-spacing-md-top">
          {errorMessage}
        </div>
      );
    }

    const progressMessage =
      uploadPercentage === 100
        ? "Upload was successful!"
        : "Still loading... Please wait.";

    return (
      <div className="success-text-color modal-spacing-md-top">
        {progressMessage}
      </div>
    );
  };

  return (
    <div className="upload-page container">
      <div className="upload-form-container">
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            bookTitle: Yup.string().required("Book Title required!"),
            bookCoverPhoto: Yup.mixed()
              .required("You need to provide a file")
              .imageDimensionCheck(WIDTH, HEIGHT)
              .imageSizeCheck(MAX_FILE_SIZE, MAX_FILE_SIZE_IN_BYTES),
            bookDescription: Yup.string().required(
              "Book Description required!"
            ),
            urlSlug: Yup.string()
              .required("URL Slug required!")
              .test("urlSlug", "This URL Slug Invalid!", (value) => {
                const regexForValidURLSlug = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

                return regexForValidURLSlug.test(value);
              }),
            issueTitle: Yup.string().required("Issue Title required!"),
            issueCoverPhoto: Yup.mixed()
              .required("A Issue Cover Photo is required!")
              .imageDimensionCheck(WIDTH, HEIGHT)
              .imageSizeCheck(MAX_FILE_SIZE, MAX_FILE_SIZE_IN_BYTES),
            issueDescription: Yup.string().required(
              "Issue Description required!"
            ),
            // issueAssets: Yup.array().of(
            //     Yup.mixed().imageDimensionCheck()
            // )
            //     .required('A Issue Assets are required!'),
            issueAssets: Yup.array().required("A Issue Assets are required!"),
            genres: Yup.array().required("You must select a genre!"),
            workCredits: Yup.array()
              .of(
                Yup.object().shape({
                  user: Yup.string().required("A user must be selected"),
                  credits: Yup.array().required("Please select credits"),
                })
              )
              .required("Must have at least one work credit"),
            // This workCredits validation represents an array of objects: [
            //     {"user": "5ef2ac98a9983fc4b33c63ac", "credits": ["Writer","Artist"]},
            //     {"user": "5f3b4020e1cdaeb34ec330f5", "credits": ["Editor"]}
            // ]
          })}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {(props) => (
            <>
              <UploadBookFields
                {...props}
                defaultSelectedUsernames={currentUsername}
              />
              <Modal
                isOpen={modalIsOpen}
                onClose={toggleModal}
                doesModalBackDropClose={false}
                isCloseButtonPresent={false}
              >
                <h2 className="modal-head">Upload Progress: </h2>
                <ProgressBar uploadPercentage={uploadPercentage} />
                {ModalStatusMessage()}
              </Modal>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default memo(UploadTemplate);
