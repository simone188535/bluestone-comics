import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  updateMe,
  updateProfilePhoto,
  updateBackgroundProfilePhoto,
} from "../../../services";
import { authActions } from "../../../actions";
import FileInputSingleUpload from "../../CommonUI/FileInputSingleUpload";
import FormikSubmissionStatus from "../../CommonUI/FormikSubmissionStatus";
import Modal from "../../CommonUI/Modal";
import "./edit-profile.scss";

const ChangeProfilePics = () => {
  const [hasErrMsg, setHasErrMsg] = useState(null);
  const dispatch = useDispatch();

  const onSubmit = async (
    { profilePhoto, backgroundPhoto },
    { setSubmitting }
  ) => {
    try {
      if (hasErrMsg) setHasErrMsg(false);

      if (profilePhoto) {
        const profilePhotoFormData = new FormData();
        profilePhotoFormData.append("profilePhoto", profilePhoto);

        await updateProfilePhoto(profilePhotoFormData);
      }

      if (backgroundPhoto) {
        const backgroundProfilePhotoFormData = new FormData();
        backgroundProfilePhotoFormData.append(
          "backgroundProfilePhoto",
          backgroundPhoto
        );
        await updateBackgroundProfilePhoto(backgroundProfilePhotoFormData);
      }

      dispatch(authActions.refetchUser());
      setSubmitting(false);
    } catch (err) {
      setHasErrMsg(true);
    }
  };

  return (
    <div className="upload-page container">
      <div className="upload-form-container">
        <Formik
          initialValues={{
            profilePhoto: null,
            backgroundPhoto: null,
          }}
          validateOnMount
          validationSchema={Yup.object().shape(
            {
              profilePhoto: Yup.mixed().when(["backgroundPhoto"], {
                is: null,
                then: Yup.mixed().required(""),
              }),
              backgroundPhoto: Yup.mixed().when(["profilePhoto"], {
                is: null,
                then: Yup.mixed().required(
                  "At least one of these fields is required."
                ),
              }),
            },
            ["profilePhoto", "backgroundPhoto"]
          )}
          onSubmit={onSubmit}
        >
          {({ isValid }) => (
            <Form className="bsc-form upload-form">
              <h1 className="form-header-text">
                <strong>Change Profile Photos</strong>
              </h1>

              <FileInputSingleUpload
                identifier="profilePhoto"
                triggerText="Select a profile Photo"
              />
              <ErrorMessage
                className="error-message error-text-color"
                component="div"
                name="profilePhoto"
              />

              <FileInputSingleUpload
                identifier="backgroundPhoto"
                triggerText="Select a Background Photo"
              />
              <ErrorMessage
                className="error-message error-text-color"
                component="div"
                name="backgroundPhoto"
              />

              <button
                type="submit"
                className="form-submit form-item"
                disabled={!isValid}
              >
                Submit
              </button>
              <FormikSubmissionStatus
                err={hasErrMsg}
                successMessage="Profile Pic updated!"
                errMsg="Something went wrong. Please try again later."
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const DeleteAccount = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  return (
    <div className="edit-profile-page container">
      <h1 className="header-text">
        <strong>Deactivate Account</strong>
      </h1>
      <p className="error-text-color warning">
        <strong>
          * Deactivating your account will remove your work from all search
          results. It does not delete existing work but rather makes them
          inaccessible to all users.
        </strong>{" "}
        In order to delete work it must be done manually from the user profile
        page. Doing so will delete them permanently!
      </p>
      <button
        type="button"
        className="bsc-button transparent transparent-red deactivation-btn"
        onClick={toggleModal}
      >
        Deactivate Account
      </button>
      <Modal
        isOpen={modalIsOpen}
        doesModalBackDropClose={false}
        onClose={toggleModal}
      >
        <div>Some child element. Anything can go in here.</div>
      </Modal>
    </div>
  );
};

const AboutYou = () => {
  const [hasErrMsg, setHasErrMsg] = useState(false);
  const dispatch = useDispatch();

  // eslint-disable-next-line camelcase
  const { first_name, last_name, username, email, bio } = useSelector(
    (state) => state.auth?.user
  );

  const onSubmit = async (
    {
      firstName,
      lastName,
      email: userEmail,
      username: userUsername,
      bio: userBio,
    },
    { setSubmitting }
  ) => {
    try {
      if (hasErrMsg) setHasErrMsg(false);

      await updateMe({
        firstName,
        lastName,
        email: userEmail,
        username: userUsername,
        bio: userBio,
      });

      dispatch(authActions.refetchUser());
      setSubmitting(false);
    } catch (err) {
      setHasErrMsg(true);
    }
  };

  return (
    <div className="upload-page container">
      <div className="upload-form-container">
        <Formik
          initialValues={{
            firstName: first_name,
            lastName: last_name,
            username,
            email,
            bio,
          }}
          validationSchema={Yup.object({
            firstName: Yup.string().required("First name required!"),
            lastName: Yup.string().required("Last name required!"),
            username: Yup.string().required("Username required!"),
            email: Yup.string()
              .email("Invalid email address!")
              .required("Email required!"),
            bio: Yup.string(),
          })}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ isValid }) => (
            <Form className="bsc-form upload-form">
              <h1 className="form-header-text">
                <strong>About Me</strong>
              </h1>

              <Field
                name="firstName"
                type="text"
                placeholder="First Name"
                className="form-input form-item"
              />
              <ErrorMessage
                name="firstName"
                className="error-message error-text-color"
                component="div"
              />

              <Field
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="form-input form-item"
              />
              <ErrorMessage
                name="lastName"
                className="error-message error-text-color"
                component="div"
              />

              <Field
                name="username"
                type="text"
                className="form-input form-item"
                placeholder="Username"
              />
              <ErrorMessage
                name="username"
                className="error-message error-text-color"
                component="div"
              />

              <Field
                name="email"
                type="email"
                className="form-input form-item"
                placeholder="Email"
              />
              <ErrorMessage
                name="email"
                className="error-message error-text-color"
                component="div"
              />

              <Field
                className="form-input form-textarea"
                name="bio"
                as="textarea"
                placeholder="Book Description"
                autoComplete="on"
              />
              <ErrorMessage
                className="error-message error-text-color"
                component="div"
                name="bio"
              />

              <button
                type="submit"
                className="form-submit form-item"
                disabled={!isValid}
              >
                Submit
              </button>
              <FormikSubmissionStatus
                err={hasErrMsg}
                successMessage="Profile updated!"
                errMsg="Something went wrong. Please try again later."
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
const EditProfile = () => {
  return (
    <>
      <ChangeProfilePics />
      <AboutYou />
      <DeleteAccount />
    </>
  );
};
export default EditProfile;
