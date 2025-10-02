import React, { useEffect, useState, memo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createIssue, getBookAndIssueImagePrefix } from "../../services";
import onUploadProgressHelper from "./onUploadProgressHelper";
import SubmissionProgressModal from "./SubmissionProgressModal";
import IssueUpload from "./IssueUpload";
import {
  // eslint-disable-next-line no-unused-vars
  imageDimensionCheck,
  // eslint-disable-next-line no-unused-vars
  imageSizeCheck,
} from "../../utils/Yup/yupCustomMethods";
import MetaTags from "../MetaTags";
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

const UploadNewIssueForm = ({
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
        Add a <strong>New Issue</strong> To An Existing Book
      </h1>
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

const UploadNewIssue = () => {
  const history = useHistory();
  const { urlSlug, bookId } = useParams();
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
        separately because node/multer will not populate req.files.
        check here for more info: https://laracasts.com/index.php/discuss/channels/vue/axios-post-multipart-formdata-object-attribute?page=1
     */

    try {
      const imagePrefixesRes = await getBookAndIssueImagePrefix(bookId);
      const { bookImagePrefixRef, issueImagePrefixRef } = imagePrefixesRes.data;
      const formData = new FormData();

      formData.append("issueTitle", values.issueTitle);
      formData.append("issueDescription", values.issueDescription);
      formData.append("workCredits", JSON.stringify(values.workCredits));
      formData.append("bookImagePrefixRef", bookImagePrefixRef);
      formData.append("issueImagePrefixRef", issueImagePrefixRef);
      formData.append("issueCoverPhoto", values.issueCoverPhoto);
      values.issueAssets.forEach((formValue) =>
        formData.append("issueAssets", formValue)
      );

      // open modal
      toggleModal();

      /*
      This is needed to show the percentage of the uploaded file. onUploadProgress is a 
      property provided by axios
      */
      const config = onUploadProgressHelper(setUploadPercentage);

      const {
        data: {
          issue: { issue_number: issueNumber },
        },
      } = await createIssue(urlSlug, bookId, formData, config);

      setTimeout(() => {
        // after a couple of seconds close modal and redirect to new page
        toggleModal();
        history.push(`/details/${urlSlug}/book/${bookId}/issue/${issueNumber}`);
      }, 500);
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
    <>
      <MetaTags
        title="Bluestone Comics | Upload New Issue"
        description="Bluestone Comics' mission statement and goals for the future."
      >
        <meta name="robots" content="noindex, nofollow" />
      </MetaTags>
      <div className="upload-page container">
        <div className="upload-form-container">
          <Formik
            initialValues={{
              issueTitle: "",
              issueCoverPhoto: null,
              issueDescription: "",
              issueAssets: [],
              workCredits: [
                { user: currentUserId, username: currentUsername, credits: [] },
              ],
            }}
            validationSchema={Yup.object().shape({
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
              issueDescription: Yup.string()
                .max(550, "Description must be at most 550 characters!")
                .required("Issue Description required!"),
              // issueAssets: Yup.array().of(
              //     Yup.mixed().imageDimensionCheck()
              // )
              //     .required('Issue Pages are required!'),
              issueAssets: Yup.array().required("Issue Pages are required!"),
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
            })}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {(props) => (
              <UploadNewIssueForm
                modalIsOpen={modalIsOpen}
                toggleModal={toggleModal}
                errorMessage={errorMessage}
                uploadPercentage={uploadPercentage}
                {...props}
              />
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
export default memo(UploadNewIssue);
