import React, { useEffect, useState, createRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { authActions } from "../../actions";
import { PublishServices } from '../../services';
import FileInputSingleUpload from '../CommonUI/FileInputSingleUpload.js';
import FileInputMultipleUpload from '../CommonUI/FileInputMultipleUpload.js';
import Checkboxes from '../CommonUI/Checkboxes.js';
import Modal from '../CommonUI/Modal';
import './upload.scss';

// MAKE THIS REUSABLE FOR BOOKS AND ISSUE UPDATES
const Upload = () => {
    const dispatch = useDispatch();
    const [enableMessage, setEnableMessage] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const onSubmit = async (values, { setSubmitting }) => {
        // dispatch(authActions.signUp(values.bookTitle, values.bookDescription, values.urlSlug, values.issueTitle, values.password, values.passwordConfirm));

        /*
        these FormData appends must be done because we are using the uploaded file data in the backend using multer. 
        in the createBook axios request, we cannot destructure the data (in the param) AND pass in the form data (in the param) 
        seperately because node/multer will not populate req.files. 
        check here for more info: https://laracasts.com/index.php/discuss/channels/vue/axios-post-multipart-formdata-object-attribute?page=1
        */

        let formData = new FormData();

        formData.append('bookTitle', values.bookTitle);
        formData.append('bookCoverPhoto', values.bookCoverPhoto);
        formData.append('bookDescription', values.bookDescription);
        formData.append('urlSlug', values.urlSlug);
        formData.append('genres', values.genres);
        formData.append('issueTitle', values.issueTitle);
        formData.append('issueCoverPhoto', values.issueCoverPhoto);

        // push all issueAssets to formData
        values.issueAssets.forEach((formValue) => formData.append('issueAssets', formValue));
        // formData.append('workCredits', values.genres);
        // formData.append('workCredits', [
        //     {"user": "5ef2ac98a9983fc4b33c63ac", "credits": ["Writer","Artist"]},
        //     {"user": "5f3b4020e1cdaeb34ec330f5", "credits": ["Editor"]}
        // ]);

        console.log('triggered', values);

        try {
            // const res = await PublishServices.createBook(formData);
            // console.log('success', res);
            toggleModal();
        } catch (err) {
            console.log('failed', err.response.data.message);
        }
        setEnableMessage(true);
        setSubmitting(false);
    }
    const toggleModal = () => setModalIsOpen(!modalIsOpen);

    return (
        <div className="upload-page">
            <div className="upload-form-container">
                <Formik
                    initialValues={{ bookTitle: '', bookCoverPhoto: null, bookDescription: '', urlSlug: '', issueTitle: '', issueCoverPhoto: null, genres: [], issueAssets: [] }}
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
                    onSubmit={onSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form className="bsc-form upload-form" encType="multipart/form-data" method="post">
                            <div className="form-header-text">Upload a <strong>New Book</strong> along with its <strong>First Issue</strong> </div>
                            <div>
                                <Field className="form-input form-item" name="bookTitle" type="text" placeholder="Book Title" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="bookTitle" />

                                <FileInputSingleUpload setFieldValue={setFieldValue} identifier="bookCoverPhoto" triggerText="Select Book Cover Photo" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="bookCoverPhoto" />

                                <Field className="form-input form-textarea" name="bookDescription" as="textarea" placeholder="Book Description" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="bookDescription" />

                                <Field className="form-input form-item" name="urlSlug" type="text" placeholder="URL Slug" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="urlSlug" />

                                <Field className="form-input form-item" name="issueTitle" type="text" placeholder="Issue Title" autoComplete="on" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="issueTitle" />

                                <FileInputSingleUpload setFieldValue={setFieldValue} identifier="issueCoverPhoto" triggerText="Select Issue Cover Photo" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="issueCoverPhoto" />

                                <Checkboxes identifier="genres" checkboxValues={['Action/Adventure', 'Anthropomorphic', 'Children', 'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 'Graphic Novels', 'Historical', 'Horror', 'LGBTQ', 'Mature', 'Music', 'Mystery', 'Mythology', 'Psychological', 'Romance', 'School Life', 'Sci-Fi', 'Slice of Life', 'Sport', 'Superhero', 'Supernatural', 'Thriller', 'War', 'Western', 'Zombies']} />

                                <FileInputMultipleUpload setFieldValue={setFieldValue} identifier="issueAssets" dropzoneInnerText="Drag 'n' drop <strong>Issue Pages</strong> here, or click to select files" className="form-input form-item" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="issueAssets" />
                            </div>
                            <button type="submit" className="form-submit form-item">Submit</button>
                        </Form>
                    )}
                </Formik>
                <button onClick={toggleModal}>open Modal</button>
                <Modal isOpen={modalIsOpen} onClose={toggleModal}>
                    <h1>Upload Progress</h1>
                    <div className="progress-bar">
                        <div className="progress"></div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
export default Upload;