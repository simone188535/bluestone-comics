import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
// import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { updateMe } from "../../../services";

const ChangeProfilePics = () => {
  return <p>ChangeProfilePics</p>;
};

const DeleteAccount = () => {
  return <p>DeleteAccount</p>;
};

const AboutYou = () => {
  const [submissionSuccessful, setSubmissionSuccessful] = useState(null);

  // eslint-disable-next-line camelcase
  const { first_name, last_name, username, email, bio } = useSelector(
    (state) => state.auth.user
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
      await updateMe({
        firstName,
        lastName,
        email: userEmail,
        username: userUsername,
        bio: userBio,
      });
      setSubmitting(false);
      setSubmissionSuccessful(true);
    } catch (err) {
      setSubmissionSuccessful(false);
    }
  };

  const submissionMsg = () => {
    if (submissionSuccessful) {
      return <div className="text-blue text-center">Updated!</div>;
    }
    if (submissionSuccessful === false) {
      return (
        <div className="error-message error-text-color text-center">
          Something went wrong. Please try again later.
        </div>
      );
    }
    return "";
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

            <button type="submit" className="form-submit form-item">
              Submit
            </button>
          </Form>
        </Formik>
        {submissionMsg()}
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
