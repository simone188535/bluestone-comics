import * as Yup from "yup";
import {
  // eslint-disable-next-line no-unused-vars
  imageDimensionCheck,
  // eslint-disable-next-line no-unused-vars
  imageSizeCheck,
} from "./yupCustomMethods";
import CONSTANTS from "../Constants";

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

const BookUploadValidation = {
  bookTitle: Yup.string()
    .max(50, "Book Title must be at most 50 characters!")
    .required("Book Title required!"),
  bookCoverPhoto: Yup.mixed()
    .required("You need to provide a file")
    .imageDimensionCheck(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
    .imageSizeCheck(THUMBNAIL_MAX_FILE_SIZE, THUMBNAIL_MAX_FILE_SIZE_IN_BYTES),
  bookDescription: Yup.string()
    .max(550, "Description must be at most 550 characters!")
    .required("Book Description required!"),
  urlSlug: Yup.string()
    .max(50, "URL slug must be at most 50 characters!")
    .test("urlSlug", "This URL Slug Invalid!", (value) => {
      const regexForValidURLSlug = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

      return regexForValidURLSlug.test(value);
    })
    .required("URL Slug required!"),
  genres: Yup.array().required("You must select a genre!"),
};

const IssueUploadValidation = {
  issueTitle: Yup.string()
    .max(50, "Issue Title must be at most 50 characters!")
    .required("Issue Title required!"),
  issueCoverPhoto: Yup.mixed()
    .required("A Issue Cover Photo is required!")
    .imageDimensionCheck(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
    .imageSizeCheck(THUMBNAIL_MAX_FILE_SIZE, THUMBNAIL_MAX_FILE_SIZE_IN_BYTES),
  issueDescription: Yup.string().required("Issue Description required!"),
  // issueAssets: Yup.array().of(
  //     Yup.mixed().imageDimensionCheck()
  // )
  //     .required('A Issue Assets are required!'),
  issueAssets: Yup.array().required("A Issue Assets are required!"),
  workCredits: Yup.array()
    .of(
      Yup.object().shape({
        user: Yup.string().required("A user must be selected"),
        username: Yup.string().required("A user must have a username"),
        credits: Yup.array().required("Please select credits"),
      })
    )
    .required("Must have at least one work credit"),
  // This workCredits validation represents an array of objects: [
  //     {"user": "5ef2ac98a9983fc4b33c63ac", "username": 'username1', "credits": ["Writer","Artist"]},
  //     {"user": "5f3b4020e1cdaeb34ec330f5", "username": 'username2', "credits": ["Editor"]}
  // ]
};

export { BookUploadValidation, IssueUploadValidation };
