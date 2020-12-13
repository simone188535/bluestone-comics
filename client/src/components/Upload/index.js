import React, { useEffect, useState, createRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authActions } from "../../actions";
import { PublishServices } from '../../services';
import FileInputSingleUpload from '../CommonUI/FileInputSingleUpload.js';
import FileInputMultipleUpload from '../CommonUI/FileInputMultipleUpload.js';
import Checkboxes from '../CommonUI/Checkboxes.js';
import Modal from '../CommonUI/Modal';
import ProgressBar from '../CommonUI/ProgressBar';
import './upload.scss';

// MAKE THIS REUSABLE FOR BOOKS AND ISSUE UPDATES
const Upload = () => {
    const dispatch = useDispatch();
    const [enableMessage, setEnableMessage] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const toggleModal = () => setModalIsOpen(!modalIsOpen);

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
            // open modal
            toggleModal();

            // This is needed to show the percentage of the uploaded file. onUploadProgress is a property provided by axios
            let config = {
                onUploadProgress: function (progressEvent) {
                    // set setUploadPercentage hook with the upload percentage
                    setUploadPercentage(
                        parseInt(
                            Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        )
                    );

                    // Clear percentage
                    setTimeout(() => setUploadPercentage(0), 10000);

                }
            };

            const res = await PublishServices.createBook(formData, config);
            console.log('success', res);
        } catch (err) {
            console.log('failed', err.response.data.message);
        }
        setEnableMessage(true);
        setSubmitting(false);
    }

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
                        genres: Yup.array()
                            .required('You must select a genre!'),
                        // This represents and array of objects: [
                        //     {"user": "5ef2ac98a9983fc4b33c63ac", "credits": ["Writer","Artist"]},
                        //     {"user": "5f3b4020e1cdaeb34ec330f5", "credits": ["Editor"]}
                        // ]
                        // workCredits: Yup.array().of(
                        //     Yup.object().shape({
                        //         user: Yup.string()
                        //         .required('A User muct be selected'),
                        //         credits: Yup.array()
                        //         .required('Please select credits')
                        //     })
                        // )

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

                                <div className="form-header-text">Select the applicable <strong>genres</strong>:</div>
                                <ul className="checkbox-group upload-checkboxes">
                                    <Checkboxes 
                                    identifier="genres" 
                                    type="multiple" 
                                    wrapperElement="li" 
                                    checkboxValue={[ { name: 'Action/Adventure'}, { name: 'Anthropomorphic' }, { name: 'Children'}, { name: 'Comedy'}, { name: 'Crime'}, { name: 'Drama'}, { name: 'Family'}, { name: 'Fantasy'}, { name: 'Graphic Novels'}, { name: 'Historical'}, { name: 'Horror'}, { name: 'LGBTQ'}, { name: 'Mature'}, { name: 'Music'}, { name: 'Mystery'}, { name: 'Mythology'}, { name: 'Psychological'}, { name: 'Romance'}, { name: 'School Life'}, { name: 'Sci-Fi'}, { name: 'Slice of Life'}, { name: 'Sport'}, { name: 'Superhero'}, { name: 'Supernatural'}, { name: 'Thriller'}, { name: 'War'}, { name: 'Western'}, { name: 'Zombies'}]} />
                                </ul>
                                <ErrorMessage className="error-message error-text-color" component="div" name="genres" />

                                <FileInputMultipleUpload setFieldValue={setFieldValue} identifier="issueAssets" dropzoneInnerText="Drag 'n' drop <strong>Issue Pages</strong> here, or click to select files" />
                                <ErrorMessage className="error-message error-text-color" component="div" name="issueAssets" />

                                <div className="form-header-text">Assign <strong>Credits</strong> for yourself and any existing users who helped create this issue: </div>
                                <div className="form-header-subtext"><strong>*Tip: There is no need to select every available field if you are the only creator. Selecting writer and artist will suffice.</strong></div>
                            </div>
                            <button type="submit" className="form-submit form-item">Submit</button>
                        </Form>
                    )}
                </Formik>
                {/* <button onClick={toggleModal}>open Modal</button> */}
                <Modal isOpen={modalIsOpen} onClose={toggleModal} >
                    <h2 className="modal-head">Upload Progress: </h2>
                    <ProgressBar uploadPercentage={uploadPercentage} />
                </Modal>
            </div>
        </div>
    );
}
export default Upload;