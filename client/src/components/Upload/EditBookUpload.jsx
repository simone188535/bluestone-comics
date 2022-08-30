import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUsersBook } from "../../services";
import BookUpload from "./BookUpload";
import {
  // eslint-disable-next-line no-unused-vars
  imageDimensionCheck,
  // eslint-disable-next-line no-unused-vars
  imageSizeCheck,
} from "../../utils/Yup/yupCustomMethods";
import LoadingSpinner from "../CommonUI/LoadingSpinner";
import Checkboxes from "../CommonUI/Checkboxes";
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

const EditBookUpload = () => {
  // redirect after completed
  const history = useHistory();
  const { urlSlug, bookId } = useParams();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);

  const currentUser = useSelector((state) => state.auth.user);
  const [currentBookInfo, setCurrentBookInfo] = useState({});
  // const [currentURLSlug] = useState(urlSlug);
  // const [currentIssueInfo, setCurrentIssueInfo] = useState({});
  // console.log(urlSlug);
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

  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  const onSubmit = async (values, { setSubmitting }) => {
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
              removed: currentBookInfo.removed,
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
                  {/* <Checkboxes
                    identifier="status"
                    type="single"
                    wrapperElement="li"
                    checkboxValue={[
                      { name: "Ongoing", value: "ongoing" },
                      { name: "Completed", value: "completed" },
                      { name: "Hiatus", value: "hiatus" },
                    ]}
                  /> */}
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
                <div className="form-header-text">
                  Select this checkbox to <strong>Delete</strong> this work
                </div>
                <div className="checkbox-group upload-checkboxes">
                  <li>
                    <label className="checkbox-item" htmlFor="removed">
                      <Field type="checkbox" name="removed" id="removed" />
                      <span>Delete</span>
                    </label>
                  </li>
                </div>
                <button type="submit" className="form-submit form-item">
                  Submit
                </button>
              </Form>
            )}
          />
        )}
      </div>
    </div>
  );
};
export default EditBookUpload;
