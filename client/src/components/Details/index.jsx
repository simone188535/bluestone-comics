import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getBook,
  getIssue,
  createBookmark,
  deleteBookmark,
} from "../../services";
import ExtraInfo from "./ExtraInfo";
import DisplayIssues from "./DisplayIssues";
import useBelongsToCurrentUser from "../../hooks/useBelongsToCurrentUser";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";
import useIsBookmarked from "../../hooks/useIsBookmarked";
import LoadingSpinner from "../CommonUI/LoadingSpinner";
import ErrMsg from "../CommonUI/ErrorMessage";
import "./details.scss";

const Details = () => {
  const [errMsg, setErrMsg] = useState("");
  const [detailInfo, setDetailInfo] = useState({});
  const [belongsToUser, setBelongsToUserCB] = useBelongsToCurrentUser();
  const [isBookmarked, isBookmarkedCB] = useIsBookmarked();
  const [bookmarkLoading, setBookmarkLoading] = useState(true);
  const [isLoggedIn] = useIsLoggedIn();
  const { urlSlug, bookId, issueNumber } = useParams();
  const {
    issueTitle,
    bookTitle,
    author,
    status,
    description,
    coverPhoto,
    title,
    dateCreated,
    lastUpdated,
    issueNum,
    totalIssuePages,
    publisherId,
  } = detailInfo;

  // If issueId does not exist then the provided URL and the data on this page is for a book.
  const isIssue = !!issueNumber;

  useEffect(() => {
    // create the initial values for whether the work is bookmarked and the loading state
    (async () => {
      try {
        await isBookmarkedCB(bookId);
      } catch (err) {
        setErrMsg(true);
      }
      setBookmarkLoading(false);
    })();
  }, [bookId, isBookmarkedCB, setErrMsg]);

  // API Call that get either the book or issue data an assigns it to the setDetailInfo state
  useEffect(() => {
    (async () => {
      try {
        // create call for getBook or getIssue and set it to state.
        const appropriateAPICall = isIssue
          ? await getIssue(urlSlug, bookId, issueNumber)
          : await getBook(urlSlug, bookId);

        const { book, issue, totalIssueAssets } = appropriateAPICall.data;
        // ADD AUTHOR, Genres, work credits, bookmark button
        // console.log(book);
        // console.log(issue);
        setDetailInfo({
          author: book?.username || issue?.username,
          publisherId: book?.publisher_id || issue?.publisher_id,
          bookTitle: book?.book_title || issue?.book_title,
          issueTitle: issue?.issue_title || null,
          coverPhoto: book?.cover_photo || issue?.cover_photo,
          description: book?.description || issue?.description,
          imagePrefixReference:
            book?.image_prefix_reference || issue?.image_prefix_reference,
          dateCreated: book?.date_created || issue?.date_created,
          lastUpdated: book?.last_updated || issue?.last_updated || null,
          removed: book?.removed || null,
          status: book?.status || issue?.status,
          URLSlug: book?.url_slug || null,
          issueBookId: issue?.book_id || null,
          issueNum: issue?.issue_number || null,
          totalIssuePages: totalIssueAssets || null,
        });
      } catch (err) {
        // setErrMsg("Something went wrong! Please try again later.");
        setErrMsg(true);
      }
    })();
  }, [bookId, isIssue, issueNumber, setErrMsg, urlSlug]);

  useEffect(() => {
    if (publisherId) {
      setBelongsToUserCB(publisherId);
    }
  }, [publisherId, setBelongsToUserCB]);

  // useEffect(() => {
  //   console.log(detailInfo);
  // }, [detailInfo]);

  const displayPrimaryInfo = (classes) => {
    return (
      <section className={`detail-description desc-detail normal ${classes}`}>
        {/* Use flex basis of 70%, flex-grow 1 and flex-shrink 1 */}
        <section className="extra-info-content-block">
          <div className="extra-info">
            <h1 className="primary-header">
              {isIssue ? issueTitle : bookTitle}
            </h1>
            <div className="desc-detail bold">
              Author:{" "}
              <Link to={`/profile/${author}`} className="desc-detail link">
                <span className="desc-detail normal">{author}</span>
              </Link>
            </div>
            {isIssue && (
              <div className="desc-detail bold">
                Book:{" "}
                <Link
                  to={`/details/${urlSlug}/book/${bookId}`}
                  className="desc-detail link"
                >
                  <span className="desc-detail normal">{bookTitle}</span>
                </Link>
              </div>
            )}
            <div className="desc-detail bold">
              Status: <span className="desc-detail normal">{status}</span>
            </div>
            <p>
              <span className="desc-detail bold">Description:</span>{" "}
              {description}
            </p>
          </div>
        </section>
      </section>
    );
  };

  const actionBtns = () => {
    let workBelongsToUserOrIsLoggedIn = false;
    let btnOption = null;

    /* 
      If the work belongs to this user, show this button. If the user is logged in and 
      the work belongs to them, the text should be 'Edit'. Does not belong to the current user, 
      but they are logged in, show the 'Bookmark text'. else Do not show the button.
    */

    const btnContent = {
      edit: {
        btnText: "Edit",
        link: `/edit-upload/${urlSlug}/book/${bookId}${
          isIssue ? `/issue/${issueNumber}` : ""
        }`,
      },
      bookmark: {
        btnText: "Bookmark",
        async onClick() {
          setBookmarkLoading(true);
          try {
            await createBookmark(bookId);
            await isBookmarkedCB(bookId);
          } catch (err) {
            setErrMsg(true);
          }
          setBookmarkLoading(false);
        },
      },
      removeBookmark: {
        btnText: "Remove Bookmark",
        async onClick() {
          setBookmarkLoading(true);
          try {
            await deleteBookmark(bookId);
            await isBookmarkedCB(bookId);
          } catch (err) {
            setErrMsg(true);
          }
          setBookmarkLoading(false);
        },
      },
    };

    if (isLoggedIn) {
      if (belongsToUser) {
        btnOption = "edit";
      } else {
        // text conditional based on whether the book is bookmarked (using isBookmarked). can be bookmark or removeBookmark
        btnOption = isBookmarked ? "removeBookmark" : "bookmark";
      }
      workBelongsToUserOrIsLoggedIn = true;
    }

    const indexedOption = btnContent[btnOption];
    const editOrBookmarkBtn = () =>
      workBelongsToUserOrIsLoggedIn && (
        <Link to={indexedOption?.link || "#"} className="action-btn-link">
          <button
            type="button"
            className="action-btn sub-edit-unsub-btn bsc-button transparent transparent-blue"
            onClick={indexedOption?.onClick}
            disabled={bookmarkLoading}
          >
            {/* if isBookmarked is loading show loading spinner, else show text */}
            {bookmarkLoading ? (
              <LoadingSpinner
                loadingStatus={bookmarkLoading}
                spinnerType="small"
                className="detail-spinner"
              />
            ) : (
              indexedOption.btnText
            )}
          </button>
        </Link>
      );

    return (
      <section className="action-btns-container action-btn-spacing secondary-info">
        <Link to="#" className="action-btn-link">
          <button
            type="button"
            className="action-btn sub-edit-unsub-btn bsc-button primary primary-round primary-glow"
            onClick={() => {}}
          >
            Read Now
          </button>
        </Link>

        {editOrBookmarkBtn()}
      </section>
    );
  };

  return (
    <div className="container-fluid details-page">
      <div
        className="bg-overlay"
        style={{ backgroundImage: `url(${coverPhoto})` }}
      >
        <div className="blur">
          <article className="primary-info">
            <section className="detail-img-container">
              {/* Use flex basis of 30%, flex-grow 1 and flex-shrink 1 */}
              {/* https://developer.mozilla.org/en-US/docs/Web/CSS/flex */}
              <img className="detail-img" src={coverPhoto} alt={title} />
              {/* maybe put rating stars here later */}
            </section>
            {displayPrimaryInfo("hide-until-lg")}
          </article>
        </div>
      </div>
      {errMsg ? (
        <div className="text-center mt-50">
          <ErrMsg
            errorStatus={errMsg}
            messageText="An Error occurred. Please try again later."
          />
        </div>
      ) : (
        <>
          {displayPrimaryInfo("show-at-lg")}
          {actionBtns()}
          <ExtraInfo
            isIssue={isIssue}
            dateCreated={dateCreated}
            lastUpdated={lastUpdated}
            issueNum={issueNum}
            totalIssuePages={totalIssuePages}
          />
          <DisplayIssues
            isIssue={isIssue}
            bookId={bookId}
            urlSlug={urlSlug}
            belongsToUser={belongsToUser}
          />
          {/* Add comment section in the future */}
        </>
      )}
    </div>
  );
};
export default Details;
