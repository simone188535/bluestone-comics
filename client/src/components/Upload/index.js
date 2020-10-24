import React, { useEffect, useState, createRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { authActions } from "../../actions";
import FileInputSingleUpload from '../CommonUI/FileInputSingleUpload.js';
import FileInputMultipleUpload from '../CommonUI/FileInputMultipleUpload.js';
import Checkboxes from '../CommonUI/Checkboxes.js';
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
        data.append('issueAssets', values.issueAssets);
        console.log('triggered', values);
        setEnableMessage(true);
        setSubmitting(false);
    }

    return (
        <div className="upload-page">
            <div className="upload-form-container">
                <Formik
                    initialValues={{ bookTitle: '', bookCoverPhoto: null, bookDescription: '', urlSlug: '', issueTitle: '', issueCoverPhoto: null, genres: [], issueAssets: [] }}
                    // initialValues={{ bookTitle: '', bookCoverPhoto: '', bookDescription: '', urlSlug: '', issueTitle: '', issueCoverPhoto: '', issueAssets: '', workCredits:'' }}
                    validationSchema={Yup.object().shape({
                        bookTitle: Yup.string()
                            .required('Book Title required!'),
                        bookCoverPhoto: Yup.mixed()
                            .required('You need to provide a file'),
                        bookDescription: Yup.string()
                            .required('Book Description required!'),
                        urlSlug: Yup.string()
                            .required('URL Slug required!'),
                        issueTitle: Yup.string()
                            .required('Issue Title required!'),
                        issueCoverPhoto: Yup.mixed()
                            .required('A Issue Cover Photo is required!'),
                        issueAssets: Yup.array()
                            .required('A Issue Assets are required!'),
                    })}
                    // onSubmit={onSubmit}
                    // initialValues={{ bookCoverPhoto: '', issueCoverPhoto: '' }}
                    onSubmit={(values) => {
                        let data = new FormData();
                        data.append('bookCoverPhoto', values.bookCoverPhoto);
                        data.append('issueCoverPhoto', values.issueCoverPhoto);
                        data.append('issueAssets', values.issueAssets);
                        console.log('triggered', values);
                    }}
                >
                    {({ setFieldValue }) => (
                        <Form className="bsc-form upload-form">
                            <div className="form-header-text">Upload a <strong>New Book</strong> along with its <strong>First Issue</strong> </div>
                            <div>
                                <Field className="form-input form-item" name="bookTitle" type="text" placeholder="Book Title" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="bookTitle" />

                                <FileInputSingleUpload setFieldValue={setFieldValue} identifier="bookCoverPhoto" triggerText="Select Book Cover Photo"/>
                                <ErrorMessage className="error-message error-text-color" component="div" name="bookCoverPhoto" />

                                <Field className="form-input form-textarea" name="bookDescription" as="textarea" placeholder="Book Description" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="bookDescription" />

                                <Field className="form-input form-item" name="urlSlug" type="text" placeholder="URL Slug" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="urlSlug" />

                                <Field className="form-input form-item" name="issueTitle" type="text" placeholder="Issue Title" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="issueTitle" />

                                <FileInputSingleUpload setFieldValue={setFieldValue} identifier="issueCoverPhoto" triggerText="Select Issue Cover Photo"/>
                                <ErrorMessage className="error-message error-text-color" component="div" name="issueCoverPhoto" />
                                
                                <Checkboxes identifier="genres" checkboxValues={['action', 'adventure', 'romance']}/>

                                <FileInputMultipleUpload setFieldValue={setFieldValue} identifier="issueAssets" dropzoneInnerText="Drag 'n' drop <strong>Issue Pages</strong> here, or click to select files" className="form-input form-item"/>
                                <ErrorMessage className="error-message error-text-color" component="div" name="issueAssets" />
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