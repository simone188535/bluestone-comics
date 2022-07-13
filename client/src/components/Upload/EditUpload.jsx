import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getUsersBook,
  getUsersIssue,
  // createBook,
  // getBookAndIssueImagePrefix,
} from "../../services";
// import UploadTemplate from "./UploadTemplate";
import UploadTextField from "./UploadTextField";
import FileInputSingleUpload from "../CommonUI/FileInputSingleUpload";
import FileInputMultipleUpload from "../CommonUI/FileInputMultipleUpload";
import "./upload.scss";

const EditUpload = () => {
  // redirect after completed
  const history = useHistory();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);

  const currentUser = useSelector((state) => state.auth.user);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentBookInfo, setCurrentBookInfo] = useState({});
  const [currentIssueInfo, setCurrentIssueInfo] = useState({});
  const { urlSlug, bookId, issueNumber } = useParams();

  useEffect(() => {
    (async () => {
      if (currentUser) {
        try {
          setCurrentUsername(currentUser.username);
          setCurrentUserId(currentUser.id);
          // retrieve book data and set it to state
          const {
            data: {
              book: {
                title: bookTitle,
                cover_photo: bookCoverPhoto,
                description: bookDesc,
              },
              bookCoverPhotoFile,
            },
          } = await getUsersBook(urlSlug, bookId);
          // console.log(bookTitle);

          setCurrentBookInfo((prevState) => ({
            ...prevState,
            bookTitle,
            bookCoverPhoto,
            bookDesc,
            bookCoverPhotoFile,
          }));

          // retrieve issue data and set it to state
          const {
            data: {
              issue: {
                title: issueTitle,
                cover_photo: issueCoverPhoto,
                description: issueDesc,
              },
              issueCoverPhotoFile,
              issueAssets,
              issueAssetFiles,
            },
          } = await getUsersIssue(urlSlug, bookId, issueNumber);

          setCurrentIssueInfo((prevState) => ({
            ...prevState,
            issueTitle,
            issueCoverPhoto,
            issueDesc,
            issueCoverPhotoFile,
            issueAssets,
            issueAssetFiles,
          }));
        } catch (err) {
          setErrorMessage(true);
        }
      }
    })();
  }, [bookId, currentUser, issueNumber, urlSlug]);

  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(false);
  };

  useEffect(() => {
    console.log("currentBookInfo", currentBookInfo);
    // console.log("currentBookInfoFile", currentBookInfo?.bookCoverPhoto);
  }, [currentBookInfo]);

  useEffect(() => {
    console.log("currentIssueInfo", currentIssueInfo);
    // console.log('currentIssueInfo', currentBookInfo?.bookCoverPhotoFile);
  }, [currentIssueInfo]);

  return (
    <Formik
      initialValues={{
        bookTitle: "",
        bookCoverPhoto: {
          name: currentBookInfo.bookCoverPhotoFile?.Metadata?.name,
          prevFile: currentBookInfo.bookCoverPhoto,
        },
        issueAssets: currentIssueInfo.issueAssets,
        // issueAssets: {
        //   existingFiles: currentIssueInfo.issueAssets,
        //   newFiles: [],
        //   toRemoveFiles: [],
        // },
      }}
      validationSchema={Yup.object({
        bookTitle: Yup.string().required("Book Title required!"),
        bookCoverPhoto: Yup.mixed().required("You need to provide a file"),
        issueAssets: Yup.array().required("A Issue Assets are required!"),
      })}
      onSubmit={onSubmit}
      enableReinitialize
    >
      <div className="upload-page container">
        <div className="upload-form-container">
          <Form
            className="bsc-form upload-form"
            encType="multipart/form-data"
            method="post"
          >
            <UploadTextField name="bookTitle" placeholder="Book Title" />
            <FileInputSingleUpload
              identifier="bookCoverPhoto"
              triggerText="Select Book Thumbnail Photo"
              hasPrevUploadedData
            />
            <FileInputMultipleUpload
              identifier="issueAssets"
              dropzoneInnerText="Drag 'n' drop <strong>Issue Pages</strong> here, or click to select files"
              hasPrevUploadedData
            />
          </Form>
        </div>
      </div>
    </Formik>
  );
  //   return (
  //     <UploadTemplate
  //       onSubmit={onSubmit}
  //       initialValues={{
  //         bookTitle: currentBookInfo.bookTitle || "",
  //         bookCoverPhoto: null,
  //         bookDescription: currentBookInfo.bookDesc || "",
  //         urlSlug: urlSlug || "",
  //         issueTitle: currentIssueInfo.issueTitle || "",
  //         issueCoverPhoto: null,
  //         issueDescription: currentIssueInfo.issueDesc || "",
  //         // bookTitle: currentBookInfo.bookTitle,
  //         // bookCoverPhoto: currentBookInfo.bookCoverPhotoFile,
  //         // bookDescription: currentBookInfo.bookDesc,
  //         // urlSlug,
  //         // issueTitle: currentIssueInfo.issueTitle,
  //         // issueCoverPhoto: currentIssueInfo.issueCoverPhotoFile,
  //         // issueDescription: currentIssueInfo.description,
  //         genres: [],
  //         issueAssets: [],
  //         workCredits: [{ user: currentUserId, credits: [] }],
  //       }}
  //       currentUsername={currentUsername}
  //       toggleModal={toggleModal}
  //       uploadPercentage={uploadPercentage}
  //       errorMessage={errorMessage}
  //     />
  //   );
  // };
};
export default EditUpload;
