import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBook, getIssue } from "../../services";
import ExtraInfo from "./ExtraInfo";
import "./details.scss";

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
        setErrMsg("Something went wrong! Please try again later.");
      }
    })();
  }, [bookId, isIssue, issueNumber, urlSlug]);

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
                <span className="desc-detail normal">
                  {detailInfo.bookTitle}
                </span>
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
          </div>
        </section>
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
      <ExtraInfo
        isIssue={isIssue}
        dateCreated={detailInfo.dateCreated}
        lastUpdated={detailInfo.lastUpdated}
        issueNum={detailInfo.issueNum}
        totalIssuePages={detailInfo.totalIssuePages}
      />
      {/* Add comment section in the future */}
    </div>
  );
};
export default Details;
