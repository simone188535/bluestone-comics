import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
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
import "./upload.scss";
import CONSTANTS from "../../utils/Constants";

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);

  const currentUser = useSelector((state) => state.auth.user);
  const [currentBookInfo, setCurrentBookInfo] = useState({});
  // const [currentIssueInfo, setCurrentIssueInfo] = useState({});
  const { urlSlug, bookId } = useParams();
  const { bookTitle, bookCoverPhoto, bookDesc, bookCoverPhotoFile } =
    currentBookInfo;

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
              },
              bookCoverPhotoFile: bookCoverPhotoFileData,
            },
          } = await getUsersBook(urlSlug, bookId);

          setCurrentBookInfo((prevState) => ({
            ...prevState,
            bookTitle: bookTitleData,
            bookCoverPhoto: bookCoverPhotoData,
            bookDesc: bookDescData,
            bookCoverPhotoFile: bookCoverPhotoFileData,
          }));
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
    <div className="upload-page container">
      <div className="upload-form-container">
        <Formik
          initialValues={{
            bookTitle: bookTitle || "",
            bookCoverPhoto: {
              name: bookCoverPhotoFile?.Metadata?.name || "",
              prevFile: bookCoverPhoto || null,
            },
            bookCoverPhotoToBeRemoved: "",
            bookDescription: bookDesc || "",
            urlSlug: urlSlug || "",
          }}
          validationSchema={Yup.object().shape({
            bookTitle: Yup.string().required("Book Title required!"),
            bookCoverPhoto: Yup.mixed()
              .required("You need to provide a file")
              .imageDimensionCheck(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
              .imageSizeCheck(
                THUMBNAIL_MAX_FILE_SIZE,
                THUMBNAIL_MAX_FILE_SIZE_IN_BYTES
              ),
            bookDescription: Yup.string().required(
              "Book Description required!"
            ),
            urlSlug: Yup.string()
              .required("URL Slug required!")
              .test("urlSlug", "This URL Slug Invalid!", (value) => {
                const regexForValidURLSlug = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

                return regexForValidURLSlug.test(value);
              }),
          })}
          onSubmit={onSubmit}
          enableReinitialize
        >
          <Form
            className="bsc-form upload-form"
            encType="multipart/form-data"
            method="post"
          >
            <h1 className="form-header-text">
              Edit An <strong>Existing Book</strong>
            </h1>
            <BookUpload />
          </Form>
        </Formik>
      </div>
    </div>
  );
};
export default EditBookUpload;
