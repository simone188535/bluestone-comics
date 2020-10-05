import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authActions } from "../../actions";
import './upload.scss';

// MAKE THIS REUSABLE FOR BOOKS AND ISSUE UPDATES
const Upload = () => {
    const dispatch = useDispatch();
    const [enableMessage, setEnableMessage] = useState(false);

    const onSubmit = async (values, { setSubmitting }) => {
        // dispatch(authActions.signUp(values.bookTitle, values.bookDescription, values.urlSlug, values.issueTitle, values.password, values.passwordConfirm));
        let data = new FormData();
        data.append('bookCoverPhoto', values.bookCoverPhoto);
        data.append('issueCoverPhoto', values.issueCoverPhoto);
        console.log('triggered', values);
        setEnableMessage(true);
        setSubmitting(false);
    }

    const singleFileFieldBinding = () => {
        // activate closest input field
    }
    return (
        <div className="upload-page">
            <div className="upload-form-container">
                <Formik
                    // initialValues={{ bookTitle: '', bookCoverPhoto: '', bookDescription: '', urlSlug: '', issueTitle: '', issueCoverPhoto: '', issueAssets: '', workCredits:'' }}
                    // validationSchema={Yup.object({
                    //     bookTitle: Yup.string()
                    //         .required('Book Title required!'),
                    //     bookDescription: Yup.string()
                    //         .required('Book Description required!'),
                    //     urlSlug: Yup.string()
                    //         .required('URL Slug required!'),
                    //     issueTitle: Yup.string()
                    //         .required('issueTitle required!')
                    // })}
                    // onSubmit={onSubmit}
                    // initialValues={{ bookCoverPhoto: '', issueCoverPhoto: '' }}
                    initialValues={{ bookCoverPhoto: '' }}
                    onSubmit={(values) => {
                        let data = new FormData();
                        data.append('bookCoverPhoto', values.bookCoverPhoto);
                        data.append('issueCoverPhoto', values.issueCoverPhoto);
                        console.log('triggered', values);
                    }}
                >
                    {({ setFieldValue }) => (
                        <Form className="bsc-form upload-form">
                            <div className="form-header-text">Please, <strong>Sign Up</strong> to continue</div>
                            <div>
                                {/* <Field className="form-input form-item" name="bookTitle" type="text" placeholder="Book Title" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="bookTitle" /> */}

                                <div className="single-file-upload-container">
                                    <input id="bookCoverPhoto" className="single-upload-field" name="bookCoverPhoto" type="file" onClick={(event) => {console.log(event.currentTarget.files[0])}} onChange={(event) => {
                                        setFieldValue("bookCoverPhoto", event.currentTarget.files[0]);
                                    }} />
                                    <label tabIndex="0" htmlFor="bookCoverPhoto" className="single-upload-field-trigger" onClick={singleFileFieldBinding()}>Select Book Cover Photo</label>
                                    <div className="single-upload-file-name ">Test</div>
                                </div>
                                {/* <Field className="form-input form-item" name="bookDescription" type="text" placeholder="Book Description" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="bookDescription" />

                                <Field className="form-input form-item" name="urlSlug" type="text" placeholder="URL Slug" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="urlSlug" />

                                <Field className="form-input form-item" name="issueTitle" type="text" placeholder="Issue Title" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="issueTitle" /> */}

                                {/* <input id="file" className="single-upload-field" name="issueCoverPhoto" type="file" onChange={(event) => {
                                    setFieldValue("issueCoverPhoto", event.currentTarget.files[0]);
                                }} /> */}
                            </div>
                            <button type="submit" className="form-submit form-item">Submit</button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
export default Upload;