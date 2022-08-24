import React, { useEffect, useState, memo } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { createBook, getBookAndIssueImagePrefix } from "../../services";
// import UploadTemplate from "./UploadTemplate";
import Modal from "../CommonUI/Modal";
import ProgressBar from "../CommonUI/ProgressBar";
import BookUpload from "./BookUpload";
import IssueUpload from "./IssueUpload";
import {
  BookUploadValidation,
  IssueUploadValidation,
} from "../../utils/Yup/yupUploadValidation";

import "./upload.scss";

const ModalStatusMessage = ({ errorMessage, uploadPercentage }) => {
  const [currentUploadPercentage, setCurrentUploadPercentage] =
    useState(uploadPercentage);

  useEffect(() => {
    setCurrentUploadPercentage(uploadPercentage);
  }, [uploadPercentage]);

  if (errorMessage) {
    return (
      <div className="error-message error-text-color modal-spacing-md-top">
        {errorMessage}
      </div>
    );
  }

  const progressMessage =
    currentUploadPercentage === 100
      ? "Upload was successful!"
      : "Still loading... Please wait.";

  return (
    <div className="success-text-color modal-spacing-md-top">
      {progressMessage}
    </div>
  );
};

const Upload = () => {
  // redirect after completed
  const history = useHistory();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const currentUser = useSelector((state) => state.auth.user);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  // if currentUser is logged in/redux state is populated
  useEffect(() => {
    if (currentUser) {
      setCurrentUsername(currentUser.username);
      setCurrentUserId(currentUser.id);
    }
  }, [currentUser]);

  const toggleModal = () => setModalIsOpen(!modalIsOpen);

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

      console.log("triggered", values);

      //   return;
      // open modal
      toggleModal();

      /*
      This is needed to show the percentage of the uploaded file. onUploadProgress is a 
      property provided by axios
      */
      const config = {
        onUploadProgress(progressEvent) {
          // set setUploadPercentage hook with the upload percentage
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          // stop bar from filling to 100 until promise is returned.
          if (progress > 95) {
            setUploadPercentage(95);
            return;
          }

          setUploadPercentage(progress);
        },
      };

      const createBookRes = await createBook(formData, config);
      // Set progress bar to 100 percent upon returned promise
      setUploadPercentage(100);

      setTimeout(() => {
        // after a couple of seconds close modal and redirect to new page
        toggleModal();
        history.push("/");
      }, 2000);

      console.log("success", createBookRes);
    } catch (err) {
      console.log("failed", err.response.data.message);
      setErrorMessage("An Error occurred. Please try again Later.");
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
            ...BookUploadValidation,
            ...IssueUploadValidation,
          })}
          enableReinitialize
          onSubmit={onSubmit}
          component={() => (
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
              <Modal isOpen={modalIsOpen} onClose={toggleModal}>
                <h2 className="modal-head">Upload Progress: </h2>
                <ProgressBar uploadPercentage={uploadPercentage} />
                <ModalStatusMessage
                  errorMessage={errorMessage}
                  uploadPercentage={uploadPercentage}
                />
              </Modal>
              <button type="submit" className="form-submit form-item">
                Submit
              </button>
            </Form>
          )}
        />
      </div>
    </div>
    // <UploadTemplate
    //   onSubmit={onSubmit}
    //   initialValues={{
    //     bookTitle: "",
    //     bookCoverPhoto: null,
    //     bookDescription: "",
    //     urlSlug: "",
    //     issueTitle: "",
    //     issueCoverPhoto: null,
    //     issueDescription: "",
    //     genres: [],
    //     issueAssets: [],
    //     workCredits: [{ user: currentUserId, credits: [] }],
    //   }}
    //   currentUsername={currentUsername}
    //   toggleModal={toggleModal}
    //   uploadPercentage={uploadPercentage}
    //   errorMessage={errorMessage}
    // />
  );
};
export default memo(Upload);
