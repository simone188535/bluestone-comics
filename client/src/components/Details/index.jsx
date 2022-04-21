import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBook, getIssue } from "../../services";
import "./details.scss";

const ExtraInfo = ({ isIssue }) => {
  const className = isIssue ? "half" : "whole";

  const detailsFirstSection = () => {
    return (
      <article className={`${className}-panel`}>
        <div className="view-full-field">
          <h3 className="tertiary-header">Accredited:</h3>
          {isIssue ? (
            <div>
              {/* Shows a list of all the creators of the current comic */}
            </div>
          ) : (
            <div>
              {/* Shows all the creators who contributed to all the issues.
          Uses the accredited component */}
            </div>
          )}
        </div>
        <div className="view-full-field">
          <h3 className="tertiary-header">Genres:</h3>
          {isIssue ? (
            <div>
              {/* Shows a list of genres of the creators of the current comic */}
            </div>
          ) : (
            <div>{/* Shows all the genres the work */}</div>
          )}
        </div>
      </article>
    );
  };

  const detailsSecondSection = () => {
    return (
      <article className={`${className}-panel`}>
        {/* Only show these fields if this is an issue */}
        {isIssue ? (
          <>
            <div className="view-half-field">
              <h3 className="tertiary-header">Total Page Count:</h3>
              <div className="desc-detail normal">Total Page Count</div>
            </div>
            <div className="view-half-field">
              <h3 className="tertiary-header">Volume/Issue #:</h3>
              <div className="desc-detail normal">Volume/Issue #</div>
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="view-half-field">
          <h3 className="tertiary-header">Date Published:</h3>
          <div className="desc-detail normal">Date Published</div>
        </div>
        <div className="view-half-field">
          <h3 className="tertiary-header">Last Updated:</h3>
          <div className="desc-detail normal">Last Updated</div>
        </div>
      </article>
    );
  };

  return (
    <section className="details">
      <h2 className="desc-detail bold text-center secondary-header">
        Extra Info
      </h2>
      <div className={`panel-container ${className}-view`}>
        {detailsFirstSection()}
        {detailsSecondSection()}
      </div>
    </section>
  );
};

const Details = () => {
  const { urlSlug, bookId, issueNumber } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [detailInfo, setDetailInfo] = useState({});

  // If issueId does not exist then the provided URL and the data on this page is for a book.
  const isIssue = !!issueNumber;

  useEffect(() => {
    (async () => {
      try {
        // create call for getBook or getIssue and set it to state.
        const appropriateAPICall = isIssue
          ? await getIssue(urlSlug, bookId, issueNumber)
          : await getBook(urlSlug, bookId);

        const { book, issue } = appropriateAPICall.data;
        // ADD AUTHOR, Genres, work credits, bookmark button
        setDetailInfo({
          id: book?.id || issue?.id,
          author: book?.username || issue?.username,
          publisherId: book?.publisher_id || issue?.publisher_id,
          bookTitle: book?.book_title || issue?.book_title,
          issueTitle: issue?.issue_title,
          coverPhoto: book?.cover_photo || issue?.cover_photo,
          description: book?.description || issue?.description,
          imagePrefixReference:
            book?.image_prefix_reference || issue?.image_prefix_reference,
          dateCreated: book?.date_created || issue?.date_created,
          lastUpdated: book?.last_updated || issue?.last_updated,
          removed: book?.removed || null,
          status: book?.status || issue?.status,
          URLSlug: book?.url_slug || null,
          issueBookId: issue?.book_id || null,
          issueNum: issue?.issue_number || null,
        });
      } catch (err) {
        setErrMsg("Something went wrong! Please try again later.");
      }
    })();
  }, [bookId, isIssue, issueNumber, urlSlug]);

  useEffect(() => {
    console.log(detailInfo);
  }, [detailInfo]);

  const displayPrimaryInfo = (classes) => {
    return (
      <section className={`detail-description desc-detail normal ${classes}`}>
        {/* Use flex basis of 70%, flex-grow 1 and flex-shrink 1 */}
        <h1 className="primary-header">
          {isIssue ? detailInfo.issueTitle : detailInfo.bookTitle}
        </h1>
        <div className="desc-detail bold">
          Author:{" "}
          <Link
            to={`/profile/${detailInfo.author}`}
            className="desc-detail link"
          >
            <span className="desc-detail normal">{detailInfo.author}</span>
          </Link>
        </div>
        {isIssue && (
          <div className="desc-detail bold">
            Book:{" "}
            <span className="desc-detail normal">{detailInfo.bookTitle}</span>
          </div>
        )}
        <div className="desc-detail bold">
          Status:{" "}
          <span className="desc-detail normal">{detailInfo.status}</span>
        </div>
        <p>
          <span className="desc-detail bold">Description:</span>{" "}
          {detailInfo.description}
        </p>
      </section>
    );
  };

  return (
    <div className="container-fluid details-page">
      <div
        className="bg-overlay"
        style={{ backgroundImage: `url(${detailInfo.coverPhoto})` }}
      >
        <div className="blur">
          <article className="primary-info">
            <section className="detail-img-container">
              {/* Use flex basis of 30%, flex-grow 1 and flex-shrink 1 */}
              {/* https://developer.mozilla.org/en-US/docs/Web/CSS/flex */}
              <img
                className="detail-img"
                src={detailInfo.coverPhoto}
                alt={detailInfo.title}
              />
              {/* maybe put rating stars here later */}
            </section>
            {displayPrimaryInfo("hide-until-lg")}
          </article>
        </div>
      </div>
      {displayPrimaryInfo("show-at-lg")}
      <section className="secondary-info">
        <ExtraInfo isIssue={isIssue} />
      </section>
      {/* Add comment section in the future */}
    </div>
  );
};
export default Details;
