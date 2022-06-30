import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getUsersBook,
  getUsersIssue,
  // createBook,
  // getBookAndIssueImagePrefix,
} from "../../services";
import UploadTemplate from "./UploadTemplate";
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
    if (currentUser) {
      setCurrentUsername(currentUser.username);
      setCurrentUserId(currentUser.id);
      // setCurrentUploadInfo((prevState) => ({
      //   ...prevState,
      //   username: currentUser.username,
      //   userId: currentUser.id,
      // }));

      //     (async () => {
      //       try {
      //         // retrieve book data and set it to state
      //         const {
      //           book: {
      //             title: bookTitle,
      //             cover_photo: bookCoverPhoto,
      //             description: bookDesc,
      //           },
      //           bookCoverPhotoFile,
      //         } = await getUsersBook(urlSlug, bookId);

      //         setCurrentBookInfo((prevState) => ({
      //           ...prevState,
      //           bookTitle,
      //           bookCoverPhoto,
      //           bookDesc,
      //           bookCoverPhotoFile,
      //         }));

      //         // retrieve issue data and set it to state
      //         const {
      //           issue: { issueTitle, cover_photo: issueCoverPhoto, description },
      //           issueCoverPhotoFile,
      //         } = await getUsersIssue(urlSlug, bookId, issueNumber);

      //         setCurrentIssueInfo((prevState) => ({
      //           ...prevState,
      //           issueTitle,
      //           issueCoverPhoto,
      //           description,
      //           issueCoverPhotoFile,
      //         }));
      //       } catch (err) {
      //         setErrorMessage(true);
      //       }
      //     })();
    }
  }, [bookId, currentUser, issueNumber, urlSlug]);

  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(false);
  };

  return (
    <UploadTemplate
      onSubmit={onSubmit}
      initialValues={{
        bookTitle: "",
        bookCoverPhoto: null,
        bookDescription: "",
        urlSlug: "",
        issueTitle: "",
        issueCoverPhoto: null,
        issueDescription: "",
        // bookTitle: currentBookInfo.bookTitle,
        // bookCoverPhoto: currentBookInfo.bookCoverPhotoFile,
        // bookDescription: currentBookInfo.bookDesc,
        // urlSlug,
        // issueTitle: currentIssueInfo.issueTitle,
        // issueCoverPhoto: currentIssueInfo.issueCoverPhotoFile,
        // issueDescription: currentIssueInfo.description,
        genres: [],
        issueAssets: [],
        workCredits: [{ user: currentUserId, credits: [] }],
      }}
      currentUsername={currentUsername}
      toggleModal={toggleModal}
      uploadPercentage={uploadPercentage}
      errorMessage={errorMessage}
    />
  );
};
export default EditUpload;
