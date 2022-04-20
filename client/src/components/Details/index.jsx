import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBook, getIssue } from "../../services";
import "./details.scss";

const Details = () => {
  const { urlSlug, bookId, issueNumber } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [detailInfo, setDetailInfo] = useState({});

  // If issueId does not exist then the provided URL and the data on this page is for a book.
  const isIssue = !!issueNumber;

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
        <section className="details">
          <h2 className="desc-detail bold text-center secondary-header">
            Details
          </h2>
          <div className="panel-container">
            <article className="half-panel">Panel 1</article>
            <article className="half-panel">Panel 2</article>
          </div>
        </section>
      </section>
      {/* Add comment section in the future */}
    </div>
  );
};
export default Details;
