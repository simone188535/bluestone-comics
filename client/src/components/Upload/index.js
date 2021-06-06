import React, { useEffect, useState, memo } from 'react';
import slugify from 'slugify';
import { useHistory } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage, useField, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { PublishServices } from '../../services';
import FileInputSingleUpload from '../CommonUI/FileInputSingleUpload.js';
import FileInputMultipleUpload from '../CommonUI/FileInputMultipleUpload.js';
import Checkboxes from '../CommonUI/Checkboxes.js';
import Modal from '../CommonUI/Modal';
import ProgressBar from '../CommonUI/ProgressBar';
import WorkCredits from './WorkCredits';
import './upload.scss';

// MAKE THIS REUSABLE FOR BOOKS AND ISSUE UPDATES
const UrlSlugifedField = ( props ) => {
    /* 
        The default value of this field is dependent on the value of the book title field. The user is 
        still able to customize it though.
    */
    const {
        values: { bookTitle },
        setFieldValue
    } = useFormikContext();
    const [field] = useField(props);

    React.useEffect(() => {
        
        setFieldValue(props.name, slugify(bookTitle));

    }, [bookTitle, setFieldValue, props.name]);

    return (
        <>
            <input {...props} {...field} />
        </>
    );
};

const UploadBookFields = ({ setFieldValue, values, errors, defaultSelectedUsernames }) => {

    const workCreditsErrorMessage = errors => {
        /* 
            This has been added because we are using a Field Array Validation within the WorkCredits Component. 
            In order to display the outer error message for this array of objects, this conditional is needed. 
            More info here: https://formik.org/docs/api/fieldarray#fieldarray-validation-gotchas
        */
        return (typeof errors.workCredits === 'string' ? <ErrorMessage className="error-message error-text-color" component="div" name="workCredits" /> : null);
    }

    return (
        <Form className="bsc-form upload-form" encType="multipart/form-data" method="post">
            <h1 className="form-header-text">Upload a <strong>New Book</strong> along with its <strong>First Issue</strong> </h1>
            <div>
                <Field className="form-input form-item" name="bookTitle" type="text" placeholder="Book Title" autoComplete="on" />
                <ErrorMessage className="error-message error-text-color" component="div" name="bookTitle" />

                <FileInputSingleUpload setFieldValue={setFieldValue} identifier="bookCoverPhoto" triggerText="Select Book Cover Photo" />
                <ErrorMessage className="error-message error-text-color" component="div" name="bookCoverPhoto" />

                <Field className="form-input form-textarea" name="bookDescription" as="textarea" placeholder="Book Description" autoComplete="on" />
                <ErrorMessage className="error-message error-text-color" component="div" name="bookDescription" />

                <UrlSlugifedField className="form-input form-item slug-field" name="urlSlug" type="text" placeholder="URL Slug" autoComplete="on"/>
                <div className="form-header-subtext"><strong>Your Comic URL will be similar to this: </strong> https://bluestonecomics.com/api/v1/read/<strong>{values.urlSlug ? values.urlSlug : '<URL Slug>'}</strong>/book/1234</div>
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
                        checkboxValue={[{ name: 'Action/Adventure' }, { name: 'Anthropomorphic' }, { name: 'Children' }, { name: 'Comedy' }, { name: 'Crime' }, { name: 'Drama' }, { name: 'Family' }, { name: 'Fantasy' }, { name: 'Graphic Novels' }, { name: 'Historical' }, { name: 'Horror' }, { name: 'LGBTQ' }, { name: 'Mature' }, { name: 'Music' }, { name: 'Mystery' }, { name: 'Mythology' }, { name: 'Psychological' }, { name: 'Romance' }, { name: 'School Life' }, { name: 'Sci-Fi' }, { name: 'Slice of Life' }, { name: 'Sport' }, { name: 'Superhero' }, { name: 'Supernatural' }, { name: 'Thriller' }, { name: 'War' }, { name: 'Western' }, { name: 'Zombies' }]} />
                </ul>
                <ErrorMessage className="error-message error-text-color" component="div" name="genres" />

                <FileInputMultipleUpload setFieldValue={setFieldValue} identifier="issueAssets" dropzoneInnerText="Drag 'n' drop <strong>Issue Pages</strong> here, or click to select files" />
                <ErrorMessage className="error-message error-text-color" component="div" name="issueAssets" />

                {/* <div className="form-header-text">Assign <strong>Work Credits</strong> for yourself and any existing users who helped create this issue: </div> */}
                <div className="form-header-text">Give <strong>Credits</strong> to yourself and any other existing users by selecting the role(s) they fulfilled while helping to create this Book/Issue: </div>
                <WorkCredits identifier="workCredits" formikValues={values} defaultSelectedUsernames={defaultSelectedUsernames} />
                {workCreditsErrorMessage(errors)}

                <div className="form-header-subtext"><strong>*Tip: There is no need to select every available field if you are the only creator. Selecting writer and artist will suffice. It may overcomplicate the search for any of your other works.</strong></div>
            </div>
            <button type="submit" className="form-submit form-item">Submit</button>
            {/*             
            This is being left for testing purposes. Example found in this video: https://www.youtube.com/watch?v=Dm0TXbGvgvo&t=142s
            <pre>{JSON.stringify(errors, null, 2)}</pre>
            <pre>{JSON.stringify(values, null, 2)}</pre>  
            */}

        </Form>
    )
}

const Upload = () => {
    // redirect after completed 
    const history = useHistory();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const currentUser = useSelector(state => state.auth.user);
    const [currentUsername, setCurrentUsername] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');

    // if currentUser is logged in/redux state is populated
    useEffect(() => {
        if (currentUser) {
            setCurrentUsername(currentUser.username);
            setCurrentUserId(currentUser.id);
        }
    }, [currentUser]);

    const toggleModal = () => setModalIsOpen(!modalIsOpen);

    const ModalStatusMessage = () => {
        if (errorMessage) {
            return <div className="error-message error-text-color modal-spacing-md-top">{errorMessage}</div>
        }
        else {
            let progressMessage = (uploadPercentage === 100) ? 'Upload was successful!' : 'Still loading... Please wait.';

            return <div className="success-text-color modal-spacing-md-top">{progressMessage}</div>
        }
    }
    const onSubmit = async (values, { setSubmitting }) => {
        /*
        these FormData appends must be done because we are using the uploaded file data in the backend using multer. 
        in the createBook axios request, we cannot destructure the data (in the param) AND pass in the form data (in the param) 
        seperately because node/multer will not populate req.files. 
        check here for more info: https://laracasts.com/index.php/discuss/channels/vue/axios-post-multipart-formdata-object-attribute?page=1
        */
    try {
    const imagePrefixesRes = await PublishServices.getBookAndIssueImagePrefix();
    const { bookImagePrefixRef, issueImagePrefixRef } =  imagePrefixesRes.data;
        console.log(
            'FbookImagePrefixRef: ',
            bookImagePrefixRef,
            'issueImagePrefixRef: ',
            issueImagePrefixRef
          );
        // console.log('res', res);
        let formData = new FormData();

        formData.append('bookTitle', values.bookTitle);
        formData.append('bookDescription', values.bookDescription);
        formData.append('urlSlug', values.urlSlug);
        formData.append('issueTitle', values.issueTitle);
        // formData cannot contain plain objects, so it must be stringified
        // values.workCredits.forEach((formValue) => formData.append('workCredits', console.log(JSON.stringify(formValue))));
        formData.append('workCredits', JSON.stringify(values.workCredits));
        // formData.append('workCredits', [
        //     {"user": "5ef2ac98a9983fc4b33c63ac", "credits": ["Writer","Artist"]},
        //     {"user": "5f3b4020e1cdaeb34ec330f5", "credits": ["Editor"]}
        // ]);

        
        formData.append('bookImagePrefixRef', bookImagePrefixRef);
        formData.append('issueImagePrefixRef', issueImagePrefixRef);
        // stringify genres
        // values.genres.forEach((formValue) => formData.append('genres', formValue));
        formData.append('genres', JSON.stringify(values.genres));
        // All Files must be moved to the bottom so that multer reads them last
        formData.append('bookCoverPhoto', values.bookCoverPhoto);
        formData.append('issueCoverPhoto', values.issueCoverPhoto);
        // push all issueAssets to formData
        values.issueAssets.forEach((formValue) => formData.append('issueAssets', formValue));
    

        console.log('triggered', values);
       
            // open modal
            toggleModal();

            // This is needed to show the percentage of the uploaded file. onUploadProgress is a property provided by axios
            let config = {
                onUploadProgress: function (progressEvent) {
                    // set setUploadPercentage hook with the upload percentage
                    let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                    // stop bar from filling to 100 until promise is returned. 
                    if (progress > 95) {
                        setUploadPercentage(95);
                        return;
                    }

                    setUploadPercentage(progress);
                }
            };

            const createBookRes = await PublishServices.createBook(formData, config);
            // Set progress bar to 100 percent upon returned promise
            setUploadPercentage(100);

            setTimeout(() => {
            // after a couple of seconds close modal and redirect to new page
            toggleModal();
            history.push("/");
            }, 3000);

            console.log('success', createBookRes);
        } catch (err) {
            console.log('failed', err.response.data.message);
            setErrorMessage('An Error occurred. Please try again Later.');
            setUploadPercentage(0);

        }

        setSubmitting(false);
    }

    return (
        <div className="upload-page container">
            <div className="upload-form-container">
                <Formik
                    initialValues={{
                        bookTitle: '',
                        bookCoverPhoto: null,
                        bookDescription: '',
                        urlSlug: '',
                        issueTitle: '',
                        issueCoverPhoto: null,
                        genres: [],
                        issueAssets: [],
                        workCredits: [{ user: currentUserId, credits: [] }]
                    }}
                    validationSchema={
                        Yup.object().shape({
                            bookTitle: Yup.string()
                                .required('Book Title required!'),
                            bookCoverPhoto: Yup.mixed()
                                .required('You need to provide a file'),
                            bookDescription: Yup.string()
                                .required('Book Description required!'),
                            urlSlug: Yup.string()
                                .required('URL Slug required!')
                                .test(
                                    'urlSlug',
                                    'This URL Slug Invalid!',
                                    value => {
                                        const regexForValidURLSlug = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
                                        
                                        return regexForValidURLSlug.test(value);
                                    }
                                  ),
                            issueTitle: Yup.string()
                                .required('Issue Title required!'),
                            issueCoverPhoto: Yup.mixed()
                                .required('A Issue Cover Photo is required!'),
                            issueAssets: Yup.array()
                                .required('A Issue Assets are required!'),
                            genres: Yup.array()
                                .required('You must select a genre!'),
                            workCredits: Yup.array().of(
                                Yup.object().shape({
                                    user: Yup.string()
                                        .required('A User muct be selected'),
                                    credits: Yup.array()
                                        .required('Please select credits')
                                })
                            ).required('Must have at least one work credit')
                            // This represents an array of objects: [
                            //     {"user": "5ef2ac98a9983fc4b33c63ac", "credits": ["Writer","Artist"]},
                            //     {"user": "5f3b4020e1cdaeb34ec330f5", "credits": ["Editor"]}
                            // ]

                        })
                    }
                    enableReinitialize={true}
                    onSubmit={onSubmit}
                >
                    {props => (
                        <>
                            <UploadBookFields {...props} defaultSelectedUsernames={currentUsername} />
                            <Modal isOpen={modalIsOpen} onClose={toggleModal} >
                                <h2 className="modal-head">Upload Progress: </h2>
                                <ProgressBar uploadPercentage={uploadPercentage} />
                                {ModalStatusMessage()}
                            </Modal>
                        </>
                    )}
                </Formik>
            </div>
        </div>
    );
}
export default memo(Upload);