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
import {
  // eslint-disable-next-line no-unused-vars
  imageDimensionCheck,
  // eslint-disable-next-line no-unused-vars
  imageSizeCheck,
} from "../../utils/Yup/yupCustomMethods";
import LoadingSpinner from "../CommonUI/LoadingSpinner";
import ErrMsg from "../CommonUI/ErrorMessage";
import onUploadProgressHelper from "./onUploadProgressHelper";
import SubmissionProgressModal from "./SubmissionProgressModal";
import Modal from "../CommonUI/Modal";
import CONSTANTS from "../../utils/Constants";
import "./upload.scss";
import "../CommonUI/Modal/styles/delete-work-modal.scss";

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

const DeleteWork = ({ urlSlug, bookId, history, username }) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteErr, setDeleteErr] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteHelper = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      // throw new Error("error");
      await deleteBook(urlSlug, bookId);
      if (username) history.push(`/profile/${username}`);
    } catch (err) {
      setDeleteErr(true);
    }
    setDeleting(false);
    setDeleteModalIsOpen(false);
  };

  const resetModal = () => {
    setDeleteModalIsOpen(false);
    setDeleteErr(false);
    setDeleting(false);
  };

  return (
    <>
      {deleteModalIsOpen && (
        <Modal
          isOpen={deleteModalIsOpen}
          onClose={() => resetModal()}
          isCloseButtonPresent={deleteErr}
          className="delete-work-modal"
        >
          {!deleteErr ? (
            <div>
              <h2>
                <strong>
                  {deleting
                    ? "Deleting...."
                    : "Are you sure that you want to permanently delete this work?"}
                </strong>
              </h2>
              {deleting && <p>This may take a while, please be patient.</p>}
            </div>
          ) : (
            <ErrMsg
              errorStatus={deleteErr}
              messageText="An Error occurred. Please try again later."
            />
          )}
          <section className="action-btn-container">
            {!deleteErr && (
              <>
                <button
                  type="button"
                  className="bsc-button action-btn transparent transparent-red prompt-btn"
                  disabled={deleting}
                  onClick={(e) => deleteHelper(e)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="bsc-button action-btn transparent transparent-blue"
                  disabled={deleting}
                  onClick={() => resetModal()}
                >
                  Cancel
                </button>
              </>
            )}
          </section>
        </Modal>
      )}
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
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const toggleModal = () => setSubmissionModalIsOpen(!submissionModalIsOpen);

  const statusOption = ["Ongoing", "Completed", "Hiatus"];

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

      formData.append("bookTitle", values.bookTitle);
      formData.append("bookDescription", values.bookDescription);
      formData.append("urlSlug", values.urlSlug);
      formData.append("genres", JSON.stringify(values.genres));
      // the removed field will need to be hooked up later. This a needed placeholder
      formData.append("removed", values.removed);

      const formDataBookCoverPhoto = new FormData();
      // All Files must be moved to the bottom so that multer reads them last
      formData.append("bookCoverPhoto", values.bookCoverPhoto);

      // console.log("triggered", values);

      //   return;
      // open modal
      toggleModal();

      /*
      This is needed to show the percentage of the uploaded file. onUploadProgress is a 
      property provided by axios
      */
      const config = onUploadProgressHelper(setUploadPercentage);

      // set state should be divided by 2
      await updateBook(urlSlug, bookId, formData);
      // set state should be multiplied by 2
      await updateBookCoverPhoto(
        urlSlug,
        bookId,
        formDataBookCoverPhoto,
        config
      );

      setTimeout(() => {
        // after a couple of seconds close modal and redirect to new page
        toggleModal();
        history.push("/");
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
              genres: currentBookInfo.genres,
              status: currentBookInfo.status,
              removed: false,
            }}
            validationSchema={Yup.object().shape({
              bookTitle: Yup.string().required("Book Title required!"),
              bookCoverPhoto: Yup.mixed().when("bookCoverPhotoToBeRemoved", {
                is: (password) => Boolean(password),
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
              bookDescription: Yup.string().required(
                "Book Description required!"
              ),
              urlSlug: Yup.string()
                .required("URL Slug required!")
                .test("urlSlug", "This URL Slug Invalid!", (value) => {
                  const regexForValidURLSlug =
                    /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

                  return regexForValidURLSlug.test(value);
                }),
              genres: Yup.array().required("You must select a genre!"),
              status: Yup.string().required("Status required!"),
            })}
            onSubmit={onSubmit}
            enableReinitialize
            component={() => (
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
                  <ul className="checkbox-group upload-checkboxes">
                    {statusOption.map((status) => (
                      <li key={`${status}-radio-item`}>
                        <label htmlFor="status">
                          <Field
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
                <DeleteWork
                  urlSlug={urlSlug}
                  bookId={bookId}
                  history={history}
                  username={currentUser?.username}
                />
              </>
            )}
          />
        )}
      </div>
    </div>
  );
};
export default EditBookUpload;
