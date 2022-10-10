import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getUsersIssue,
  getPrevExistingIssueWorkCredits,
  getBookAndIssueImagePrefix,
  updateIssueAssets,
} from "../../services";
import LoadingSpinner from "../CommonUI/LoadingSpinner";
import onUploadProgressHelper from "./onUploadProgressHelper";
import SubmissionProgressModal from "./SubmissionProgressModal";
import DeleteWorkModal from "./DeleteWorkModal";
import IssueUpload from "./IssueUpload";
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

const EditIssueUpload = () => {
  // redirect after completed
  const history = useHistory();
  const { urlSlug, bookId, issueNumber } = useParams();
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [prevExistingWorkCredits, setPrevExistingWorkCredits] = useState([]);
  const [submissionModalIsOpen, setSubmissionModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const toggleModal = () => setSubmissionModalIsOpen(!submissionModalIsOpen);

  const currentUser = useSelector((state) => state.auth.user);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentIssueInfo, setCurrentIssueInfo] = useState({});

  useEffect(() => {
    (async () => {
      if (currentUser) {
        try {
          setCurrentUsername(currentUser.username);
          setCurrentUserId(currentUser.id);

          // retrieve issue data and set it to state
          const {
            data: {
              issue: {
                title: issueTitle,
                cover_photo: issueCoverPhotoData,
                description: issueDesc,
              },
              issueCoverPhotoFile: issueCoverPhotoFileData,
              issueAssets,
            },
          } = await getUsersIssue(urlSlug, bookId, issueNumber);

          setCurrentIssueInfo((prevState) => ({
            ...prevState,
            issueTitle,
            issueCoverPhoto: {
              prevFile: issueCoverPhotoData,
              ...issueCoverPhotoFileData,
            },
            issueDesc,
            issueAssets,
          }));

          const {
            data: { workCredits },
          } = await getPrevExistingIssueWorkCredits(
            urlSlug,
            bookId,
            issueNumber
          );
          setPrevExistingWorkCredits(workCredits);
          setLoadingInitialData(false);
        } catch (err) {
          setErrorMessage(true);
        }
      }
    })();
  }, [bookId, currentUser, issueNumber, urlSlug]);

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const newlyAddedFilePageNums = [];
      const prevIssueAssetsUpdatedPageNums = [];

      const imagePrefixesRes = await getBookAndIssueImagePrefix(
        bookId,
        issueNumber
      );
      const { bookImagePrefixRef, issueImagePrefixRef } = imagePrefixesRes.data;
      // console.log(bookImagePrefixRef, issueImagePrefixRef);

      const issueAssetsFormData = new FormData();

      issueAssetsFormData.append("bookImagePrefixRef", bookImagePrefixRef);
      issueAssetsFormData.append("issueImagePrefixRef", issueImagePrefixRef);

      // console.log('issueAssets', values.issueAssets);
      const prevIssueAssets = [];

      // if the issueAssets file is preexisting/is an object, stringify it, else just use the newly uploaded file
      values.issueAssets.forEach((formValue, index) => {
        const currentPageNum = index + 1;
        if (formValue instanceof File) {
          // add file to new issue assets
          issueAssetsFormData.append("issueAssets", formValue);
          // add page number
          newlyAddedFilePageNums.push(currentPageNum);
        } else {
          // add file to prev/existing issue assets
          prevIssueAssets.push(formValue);
          // add page number
          prevIssueAssetsUpdatedPageNums.push(currentPageNum);
        }
      });

      // page numbers for (newly uploaded) issueAssets
      issueAssetsFormData.append(
        "newIssueAssetsPageNums",
        JSON.stringify(newlyAddedFilePageNums)
      );

      // array of obj for prev/existing issue assets
      issueAssetsFormData.append(
        "prevIssueAssets",
        JSON.stringify(prevIssueAssets)
      );
      // updated page numbers for prev/existing issue assets
      issueAssetsFormData.append(
        "prevIssueAssetsUpdatedPageNums",
        JSON.stringify(prevIssueAssetsUpdatedPageNums)
      );

      // array of obj for issue assets that need to be removed
      issueAssetsFormData.append(
        "issueAssetsToBeRemoved",
        JSON.stringify(values.issueAssetsToBeRemoved)
      );

      // TODO: dont forget to add the progress helper
      await updateIssueAssets(
        urlSlug,
        bookId,
        issueNumber,
        issueAssetsFormData
      );

      // for (const pair of issueAssetsFormData.entries()) {
      //   console.log(`${pair[0]}, ${pair[1]}`);
      // }
      // console.log('issueAssetsFormData', issueAssetsFormData.getAll('issueAssets'));

      //   const formData = new FormData();
      //   formData.append("title", values.bookTitle);
      //   formData.append("description", values.bookDescription);
      //   formData.append("urlSlug", values.urlSlug);
      //   formData.append("genres", JSON.stringify(values.genres));
      //   formData.append("status", values.status);
      //   // the removed field will need to be hooked up later. This a needed placeholder
      //   formData.append("removed", values.removed);
      //   const formDataBookCoverPhoto = new FormData();
      //   // All Files must be moved to the bottom so that multer reads them last
      //   formDataBookCoverPhoto.append("bookCoverPhoto", values.bookCoverPhoto);
      //   // console.log("triggered", values);
      //   //   return;
      //   // open modal
      //   toggleModal();
      //   /*
      //   This is needed to show the percentage of the uploaded file. onUploadProgress is a
      //   property provided by axios
      //   */
      //   // onUploadProgressHelper is be divided by 2 because the first awaited function was first 50% of the upload and the other awaited function is the last 50% of the upload
      //   const configUpdateBook = onUploadProgressHelper(setUploadPercentage, 2);
      //   await updateBook(urlSlug, bookId, formData, configUpdateBook);
      //   const setRemainingUploadPercentage = (remainingPercentage) =>
      //     setUploadPercentage((prevState) => prevState + remainingPercentage);
      //   const configUpdateBookCoverPhoto = onUploadProgressHelper(
      //     setRemainingUploadPercentage,
      //     2
      //   );
      //   await updateBookCoverPhoto(
      //     urlSlug,
      //     bookId,
      //     formDataBookCoverPhoto,
      //     configUpdateBookCoverPhoto
      //   );
      //   setTimeout(() => {
      //     // after a couple of seconds close modal and redirect to new page
      //     toggleModal();
      //     history.push(`/profile/${currentUserName}`);
      //   }, 500);
      //   // console.log("success", createBookRes);
    } catch (err) {
      //   // console.log("failed", err.response.data.message);
      setErrorMessage(
        "An Error occurred while updating the data for this work. Please try again later."
      );
      setUploadPercentage(0);
    }
    setSubmitting(false);
  };

  const deleteModal = async () => {
    // await deleteBook(urlSlug, bookId);
    // history.push(`/profile/${currentUserName}`);
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
              issueTitle: currentIssueInfo.issueTitle,
              issueCoverPhoto: currentIssueInfo.issueCoverPhoto,
              issueCoverPhotoToBeRemoved: "",
              issueDescription: currentIssueInfo.issueDesc,
              issueAssets: currentIssueInfo.issueAssets,
              issueAssetsToBeRemoved: [],
              workCredits: prevExistingWorkCredits,
              // workCredits: [
              //   {
              //     user: "82",
              //     username: "super9cookie",
              //     credits: ["colorist", "penciller"],
              //   },
              //   {
              //     user: "80",
              //     username: "supercookie",
              //     credits: ["artist", "cover artist"],
              //   },
              // ],
            }}
            validationSchema={Yup.object().shape({
              issueTitle: Yup.string().required("Issue Title required!"),
              issueCoverPhoto: Yup.mixed().when("issueCoverPhotoToBeRemoved", {
                is: (password) => Boolean(password),
                then: Yup.mixed()
                  .required("You need to provide a file")
                  .imageDimensionCheck(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
                  .imageSizeCheck(
                    THUMBNAIL_MAX_FILE_SIZE,
                    THUMBNAIL_MAX_FILE_SIZE_IN_BYTES
                  ),
              }),
              issueDescription: Yup.string().required(
                "Issue Description required!"
              ),
              issueAssets: Yup.array().required("A Issue Assets are required!"),
              workCredits: Yup.array()
                .of(
                  Yup.object().shape({
                    user: Yup.string().required("A user must be selected"),
                    username: Yup.string().required(
                      "A user must have a username"
                    ),
                    credits: Yup.array().required("Please select credits"),
                  })
                )
                .required("Must have at least one work credit"),
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
                    Edit An <strong>Existing Issue</strong>
                  </h1>
                  <IssueUpload
                    issueCoverPhotoData={{
                      identifier: "issueCoverPhoto",
                      toBeRemovedField: "issueCoverPhotoToBeRemoved",
                      hasPrevUploadedData: true,
                    }}
                    multiFileUploadPrevData={{
                      identifier: "issueAssets",
                      toBeRemovedField: "issueAssetsToBeRemoved",
                      hasPrevUploadedData: true,
                    }}
                  />
                  {/* <UploadTextField name="bookTitle" placeholder="Book Title" />
            <FileInputSingleUpload
              identifier="bookCoverPhoto"
              triggerText="Select Book Thumbnail Photo"
              toBeRemovedField="bookCoverPhotoToBeRemoved"
              hasPrevUploadedData
            />
            <FileInputMultipleUpload
              identifier="issueAssets"
              dropzoneInnerText="Drag 'n' drop <strong>Issue Pages</strong> here, or click to select files"
              toBeRemovedField="issueAssetsToBeRemoved"
              hasPrevUploadedData
            />

            <WorkCredits identifier="workCredits" /> */}
                  {/* {workCreditsErrorMessage(errors)} */}
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
            )}
          />
        )}
      </div>
    </div>
  );
};
export default EditIssueUpload;
