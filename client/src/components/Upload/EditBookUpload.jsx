import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getUsersBook,
  updateBook,
  deleteBook,
  updateBookCoverPhoto,
} from "../../services";
import BookUpload from "./BookUpload";
import DeleteWorkModal from "./DeleteWorkModal";
import {
  // eslint-disable-next-line no-unused-vars
  imageDimensionCheck,
  // eslint-disable-next-line no-unused-vars
  imageSizeCheck,
} from "../../utils/Yup/yupCustomMethods";
import LoadingSpinner from "../CommonUI/LoadingSpinner";
import onUploadProgressHelper from "./onUploadProgressHelper";
import SubmissionProgressModal from "./SubmissionProgressModal";
import CONSTANTS from "../../utils/Constants";
import "./upload.scss";

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

const statusOption = ["Ongoing", "Completed", "Hiatus"];

const EditBookForm = ({
  submissionModalIsOpen,
  toggleModal,
  errorMessage,
  uploadPercentage,
  deleteModalIsOpen,
  setDeleteModalIsOpen,
  deleteModal,
}) => {
  return (
    <>
      <Form
        className="bsc-form upload-form"
        encType="multipart/form-data"
        method="post"
      >
        <h1 className="form-header-text">
          Edit An <strong>Existing Book</strong>
        </h1>

        <BookUpload
          bookCoverPhotoData={{
            identifier: "bookCoverPhoto",
            toBeRemovedField: "bookCoverPhotoToBeRemoved",
            hasPrevUploadedData: true,
          }}
        />
        <div className="form-header-text">
          Select the <strong>status</strong> of this book:
        </div>
        <ul className="checkbox-group upload-checkboxes radio-btn-group">
          {statusOption.map((status) => (
            <li key={`${status}-radio-item`}>
              <label htmlFor="status" className="radio-label">
                <Field
                  className="radio-btn"
                  type="radio"
                  name="status"
                  value={status.toLowerCase()}
                  id={status}
                />
                {status}
              </label>
            </li>
          ))}
        </ul>
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="status"
        />
        <SubmissionProgressModal
          modalIsOpen={submissionModalIsOpen}
          toggleModal={toggleModal}
          errorMessage={errorMessage}
          uploadPercentage={uploadPercentage}
        />
        <button type="submit" className="form-submit form-item">
          Submit
        </button>
      </Form>
      <DeleteWorkModal
        deleteModalIsOpen={deleteModalIsOpen}
        setDeleteModalIsOpen={setDeleteModalIsOpen}
        deleteMethod={deleteModal}
      />
      <section className="delete-book-btn-section">
        <h1 className="delete-book-btn-header">
          <strong>Permanently Delete This Book!</strong>
        </h1>
        <button
          type="button"
          className="bsc-button transparent transparent-red delete-book-btn prompt-btn"
          onClick={() => setDeleteModalIsOpen(true)}
        >
          Delete Book
        </button>
      </section>
    </>
  );
};

const EditBookUpload = () => {
  // redirect after completed
  const history = useHistory();
  const { urlSlug, bookId } = useParams();
  const [loadingInitialData, setLoadingInitialData] = useState(true);

  const currentUser = useSelector((state) => state.auth.user);
  const [currentBookInfo, setCurrentBookInfo] = useState({});

  const [submissionModalIsOpen, setSubmissionModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const toggleModal = () => setSubmissionModalIsOpen(!submissionModalIsOpen);

  const currentUserName = currentUser?.username;

  useEffect(() => {
    (async () => {
      if (currentUser) {
        try {
          // retrieve book data and set it to state
          const {
            data: {
              book: {
                title: bookTitleData,
                cover_photo: bookCoverPhotoData,
                description: bookDescData,
                status: statusData,
                removed: removedData,
                content_rating: contentRatingData,
              },
              bookCoverPhotoFile: bookCoverPhotoFileData,
              genres: genresData,
            },
          } = await getUsersBook(urlSlug, bookId);

          const genreList = genresData.map((currentGenre) =>
            currentGenre.genre.toLowerCase()
          );

          // console.log('bookCoverPhotoFileData', bookCoverPhotoFileData);
          // console.log('bookCoverPhotoData', bookCoverPhotoData);

          setCurrentBookInfo((prevState) => ({
            ...prevState,
            bookTitle: bookTitleData,
            bookCoverPhoto: {
              prevFile: bookCoverPhotoData,
              ...bookCoverPhotoFileData,
            },
            bookDesc: bookDescData,
            genres: genreList,
            currentURLSlug: urlSlug,
            status: statusData,
            removed: removedData,
            contentRating: contentRatingData,
          }));

          setLoadingInitialData(false);
        } catch (err) {
          setErrorMessage(true);
        }
      }
    })();
  }, [bookId, currentUser, urlSlug]);

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      formData.append("title", values.bookTitle);
      formData.append("description", values.bookDescription);
      formData.append("urlSlug", values.urlSlug);
      formData.append("contentRating", values.contentRating);
      formData.append("genres", JSON.stringify(values.genres));
      formData.append("status", values.status);
      // the removed field will need to be hooked up later. This a needed placeholder
      formData.append("removed", values.removed);

      const formDataBookCoverPhoto = new FormData();
      // All Files must be moved to the bottom so that multer reads them last
      formDataBookCoverPhoto.append("bookCoverPhoto", values.bookCoverPhoto);

      // console.log("triggered", values);

      //   return;
      // open modal
      toggleModal();

      /*
      This is needed to show the percentage of the uploaded file. onUploadProgress is a 
      property provided by axios
      */

      // onUploadProgressHelper is be divided by 2 because the first awaited function was first 50% of the upload and the other awaited function is the last 50% of the upload
      const setRemainingUploadPercentage = (remainingPercentage) =>
        setUploadPercentage((prevState) => prevState + remainingPercentage);

      const configUpdateBookCoverPhoto = onUploadProgressHelper(
        setRemainingUploadPercentage,
        2
      );

      await updateBook(urlSlug, bookId, formData, configUpdateBookCoverPhoto);

      await updateBookCoverPhoto(
        urlSlug,
        bookId,
        formDataBookCoverPhoto,
        configUpdateBookCoverPhoto
      );

      setTimeout(() => {
        // after a couple of seconds close modal and redirect to new page
        toggleModal();
        history.push(`/details/${urlSlug}/book/${bookId}`);
      }, 500);

      // console.log("success", createBookRes);
    } catch (err) {
      // console.log("failed", err.response.data.message);
      setErrorMessage(
        "An Error occurred while updating the data for this work. Please try again later."
      );
      setUploadPercentage(0);
    }
    setSubmitting(false);
  };

  const deleteModal = async () => {
    await deleteBook(urlSlug, bookId);
    history.push(`/profile/${currentUserName}`);
  };

  return (
    <div className="upload-page container min-vh100">
      <div className="upload-form-container">
        {loadingInitialData ? (
          <LoadingSpinner
            loadingStatus={loadingInitialData}
            spinnerType="large"
            className="edit-upload-loading-spinner"
          />
        ) : (
          <Formik
            initialValues={{
              bookTitle: currentBookInfo.bookTitle,
              bookCoverPhoto: currentBookInfo.bookCoverPhoto,
              bookCoverPhotoToBeRemoved: "",
              bookDescription: currentBookInfo.bookDesc,
              urlSlug: currentBookInfo.currentURLSlug,
              contentRating: currentBookInfo.contentRating,
              genres: currentBookInfo.genres,
              status: currentBookInfo.status,
              removed: false,
            }}
            validationSchema={Yup.object().shape({
              bookTitle: Yup.string()
                .max(50, "Book Title must be at most 50 characters!")
                .required("Book Title required!"),
              bookCoverPhoto: Yup.mixed().when("bookCoverPhotoToBeRemoved", {
                is: (val) => Boolean(val),
                then: Yup.mixed()
                  .required("You need to provide a file")
                  .imageDimensionCheck(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
                  .imageSizeCheck(
                    THUMBNAIL_MAX_FILE_SIZE,
                    THUMBNAIL_MAX_FILE_SIZE_IN_BYTES
                  ),
              }),
              // bookCoverPhoto: Yup.mixed()
              //   .required("You need to provide a file")
              //   .imageDimensionCheck(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
              //   .imageSizeCheck(
              //     THUMBNAIL_MAX_FILE_SIZE,
              //     THUMBNAIL_MAX_FILE_SIZE_IN_BYTES
              //   ),
              bookDescription: Yup.string()
                .max(550, "Description must be at most 550 characters!")
                .required("Book Description required!"),
              urlSlug: Yup.string()
                .max(50, "URL slug must be at most 50 characters!")
                .test("urlSlug", "This URL Slug Invalid!", (value) => {
                  const regexForValidURLSlug =
                    /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

                  return regexForValidURLSlug.test(value);
                })
                .required("URL Slug required!"),
              contentRating: Yup.string().required("Content Rating required!"),
              genres: Yup.array().required("You must select a genre!"),
              status: Yup.string().required("Status required!"),
            })}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {(props) => (
              <EditBookForm
                submissionModalIsOpen={submissionModalIsOpen}
                toggleModal={toggleModal}
                errorMessage={errorMessage}
                uploadPercentage={uploadPercentage}
                deleteModalIsOpen={deleteModalIsOpen}
                setDeleteModalIsOpen={setDeleteModalIsOpen}
                deleteModal={deleteModal}
                {...props}
              />
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};
export default EditBookUpload;
