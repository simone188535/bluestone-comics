import React, { useEffect, useState, createRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authActions } from "../../actions";
import FileInputSingleUpload from '../CommonUI/FileInputSingleUpload.js';
import './upload.scss';

// MAKE THIS REUSABLE FOR BOOKS AND ISSUE UPDATES
const Upload = () => {
    const dispatch = useDispatch();
    const [enableMessage, setEnableMessage] = useState(false);

    const singleUpoadFileFieldValue = () => {
        // activate closest input field
        // const targetRef = textInput;
        // const targetRef = ReactDOM.findDOMNode(this);
        // console.log('target refffff', targetRef);
        // const inputVal = document.getElementById('bookCoverPhoto');
        // console.log(targetedElement,' uhiu', inputVal);

        return 'single file test'
    }

    // useEffect(()=> {
    //     singleUpoadFileFieldValue()
    // },[singleUpoadFileFieldValue])
    
    const onSubmit = async (values, { setSubmitting }) => {
        // dispatch(authActions.signUp(values.bookTitle, values.bookDescription, values.urlSlug, values.issueTitle, values.password, values.passwordConfirm));
        let data = new FormData();
        data.append('bookCoverPhoto', values.bookCoverPhoto);
        data.append('issueCoverPhoto', values.issueCoverPhoto);
        console.log('triggered', values);
        setEnableMessage(true);
        setSubmitting(false);
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

{/* 
                                <div className="file-input-single-upload-container">
                                    <input id="bookCoverPhoto" className="file-input-single-upload-field" name="bookCoverPhoto" type="file" onClick={(event) => { console.log(event.currentTarget.files[0]) }} onChange={(event) => {
                                        setFieldValue("bookCoverPhoto", event.currentTarget.files[0]);
                                    }} />
                                    <label tabIndex="0" htmlFor="bookCoverPhoto" className="file-input-single-upload-trigger">Select Book Cover Photo</label>
                                    <div className="file-input-single-upload-name">{singleUpoadFileFieldValue()}</div>
                                </div> */}
                                <FileInputSingleUpload setFieldValue={setFieldValue} identifier="bookCoverPhoto" triggerText="Select Book Cover Photo"/>


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