import React, { useEffect, useState, memo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { createBook, getBookAndIssueImagePrefix } from "../../services";
import onUploadProgressHelper from "./onUploadProgressHelper";
import SubmissionProgressModal from "./SubmissionProgressModal";
import BookUpload from "./BookUpload";
import IssueUpload from "./IssueUpload";
import {
  // eslint-disable-next-line no-unused-vars
  imageDimensionCheck,
  // eslint-disable-next-line no-unused-vars
  imageSizeCheck,
} from "../../utils/Yup/yupCustomMethods";
import "./upload.scss";
import CONSTANTS from "../../utils/Constants";

const {
  IMAGE_UPLOAD_DIMENSIONS: {
    THUMBNAIL: {
      WIDTH: THUMBNAIL_WIDTH,
      HEIGHT: THUMBNAIL_HEIGHT,
      MAX_FILE_SIZE: THUMBNAIL_MAX_FILE_SIZE,
      MAX_FILE_SIZE_IN_BYTES: THUMBNAIL_MAX_FILE_SIZE_IN_BYTES,
    },
  },
} = CONSTANTS;

const BookUploadForm = ({
  modalIsOpen,
  toggleModal,
  errorMessage,
  uploadPercentage,
}) => {
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
      <BookUpload />
      <IssueUpload />
      <SubmissionProgressModal
        modalIsOpen={modalIsOpen}
        toggleModal={toggleModal}
        errorMessage={errorMessage}
        uploadPercentage={uploadPercentage}
      />
      <button type="submit" className="form-submit form-item">
        Submit
      </button>
    </Form>
  );
};

const Upload = () => {
  // redirect after completed
  const history = useHistory();
  const currentUser = useSelector((state) => state.auth.user);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  // if currentUser is logged in/redux state is populated
  useEffect(() => {
    if (currentUser) {
      setCurrentUsername(currentUser.username);
      setCurrentUserId(currentUser.id);
    }
  }, [currentUser]);

  const onSubmit = async (values, { setSubmitting }) => {
    /*
        these FormData appends must be done because we are using the uploaded file data in the backend using multer.
        in the createBook axios request, we cannot destructure the data (in the param) AND pass in the form data (in the param)
        seperately because node/multer will not populate req.files.
        check here for more info: https://laracasts.com/index.php/discuss/channels/vue/axios-post-multipart-formdata-object-attribute?page=1
     */

    try {
      const imagePrefixesRes = await getBookAndIssueImagePrefix();
      const { bookImagePrefixRef, issueImagePrefixRef } = imagePrefixesRes.data;
      // console.log('res', res);
      const formData = new FormData();

      formData.append("bookTitle", values.bookTitle);
      formData.append("bookDescription", values.bookDescription);
      formData.append("urlSlug", values.urlSlug);
      formData.append("contentRating", values.contentRating);
      formData.append("issueTitle", values.issueTitle);
      formData.append("issueDescription", values.issueDescription);
      // formData cannot contain plain objects, so it must be stringified
      /* values.workCredits.forEach((formValue) => formData.append('workCredits',
      console.log(JSON.stringify(formValue))));
      */
      formData.append("workCredits", JSON.stringify(values.workCredits));
      // formData.append('workCredits', [
      //     {"user": "5ef2ac98a9983fc4b33c63ac", "credits": ["Writer","Artist"]},
      //     {"user": "5f3b4020e1cdaeb34ec330f5", "credits": ["Editor"]}
      // ]);

      formData.append("bookImagePrefixRef", bookImagePrefixRef);
      formData.append("issueImagePrefixRef", issueImagePrefixRef);
      // stringify genres
      // values.genres.forEach((formValue) => formData.append('genres', formValue));
      formData.append("genres", JSON.stringify(values.genres));
      // All Files must be moved to the bottom so that multer reads them last
      formData.append("bookCoverPhoto", values.bookCoverPhoto);
      formData.append("issueCoverPhoto", values.issueCoverPhoto);
      // push all issueAssets to formData
      values.issueAssets.forEach((formValue) =>
        formData.append("issueAssets", formValue)
      );

      // console.log("triggered", values);

      //   return;
      // open modal
      toggleModal();

      /*
      This is needed to show the percentage of the uploaded file. onUploadProgress is a 
      property provided by axios
      */
      const config = onUploadProgressHelper(setUploadPercentage);

      // const createBookRes = await createBook(formData, config);
      const {
        data: {
          book: { id },
        },
      } = await createBook(formData, config);

      setTimeout(() => {
        // after a couple of seconds close modal and redirect to new page
        toggleModal();
        history.push(`/details/${values.urlSlug}/book/${id}`);
      }, 500);

      // console.log("success", createBookRes);
    } catch (err) {
      // console.log("failed", err.response.data.message);
      setErrorMessage(
        "An Error occurred while uploading. Please try again later."
      );
      setUploadPercentage(0);
    }

    setSubmitting(false);
  };

  return (
    <div className="upload-page container">
      <div className="upload-form-container">
        <Formik
          initialValues={{
            bookTitle: "",
            bookCoverPhoto: null,
            bookDescription: "",
            urlSlug: "",
            contentRating: "",
            issueTitle: "",
            issueCoverPhoto: null,
            issueDescription: "",
            genres: [],
            issueAssets: [],
            workCredits: [
              { user: currentUserId, username: currentUsername, credits: [] },
            ],
          }}
          validationSchema={Yup.object().shape({
            bookTitle: Yup.string()
              .max(50, "Book Title must be at most 50 characters!")
              .required("Book Title required!"),
            bookCoverPhoto: Yup.mixed()
              .required("You need to provide a file")
              .imageDimensionCheck(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
              .imageSizeCheck(
                THUMBNAIL_MAX_FILE_SIZE,
                THUMBNAIL_MAX_FILE_SIZE_IN_BYTES
              ),
            bookDescription: Yup.string().required(
              "Book Description required!"
            ),
            urlSlug: Yup.string()
              .required("URL Slug required!")
              .max(50, "URL slug must be at most 50 characters!")
              .test("urlSlug", "This URL Slug Invalid!", (value) => {
                const regexForValidURLSlug = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

                return regexForValidURLSlug.test(value);
              }),
            contentRating: Yup.string().required("Content Rating required!"),
            issueTitle: Yup.string()
              .max(50, "Issue Title must be at most 50 characters!")
              .required("Issue Title required!"),
            issueCoverPhoto: Yup.mixed()
              .required("A Issue Cover Photo is required!")
              .imageDimensionCheck(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
              .imageSizeCheck(
                THUMBNAIL_MAX_FILE_SIZE,
                THUMBNAIL_MAX_FILE_SIZE_IN_BYTES
              ),
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
                  username: Yup.string().required(
                    "A user must have a username"
                  ),
                  credits: Yup.array().required("Please select credits"),
                })
              )
              .required("Must have at least one work credit"),
            // This workCredits validation represents an array of objects: [
            //     {"user": "5ef2ac98a9983fc4b33c63ac", "username": 'username1', "credits": ["Writer","Artist"]},
            //     {"user": "5f3b4020e1cdaeb34ec330f5", "username": 'username2', "credits": ["Editor"]}
            // ]
          })}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {(props) => (
            <BookUploadForm
              {...props}
              modalIsOpen={modalIsOpen}
              toggleModal={toggleModal}
              errorMessage={errorMessage}
              uploadPercentage={uploadPercentage}
            />
          )}
        </Formik>
      </div>
    </div>
  );
};
export default memo(Upload);
