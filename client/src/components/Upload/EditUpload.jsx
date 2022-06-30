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
          console.log(bookTitle);

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
            },
          } = await getUsersIssue(urlSlug, bookId, issueNumber);

          setCurrentIssueInfo((prevState) => ({
            ...prevState,
            issueTitle,
            issueCoverPhoto,
            issueDesc,
            issueCoverPhotoFile,
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

  return (
    <UploadTemplate
      onSubmit={onSubmit}
      initialValues={{
        bookTitle: currentBookInfo.bookTitle || "",
        bookCoverPhoto: null,
        bookDescription: currentBookInfo.bookDesc || "",
        urlSlug: urlSlug || "",
        issueTitle: currentIssueInfo.issueTitle || "",
        issueCoverPhoto: null,
        issueDescription: currentIssueInfo.issueDesc || "",
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
