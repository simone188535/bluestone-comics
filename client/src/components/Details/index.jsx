import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getBook, getIssue } from "../../services";
import "./details.scss";

const Details = () => {
  const { urlSlug, bookId, issueId } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [detailInfo, setDetailInfo] = useState(null);

  // If issueId does not exist then the provided URL and the data on this page is for a book.
  const isIssue = !!issueId;

  // console.log({isIssue});

  useEffect(() => {
    (async () => {
      try {
        // create call for getBook or getIssue and set it to state.
        const appropiateAPICall = isIssue
          ? getIssue(urlSlug, bookId)
          : getBook(urlSlug, bookId, issueId);

        const { book, issue } = await appropiateAPICall;
        setDetailInfo(book ?? issue);
      } catch (err) {
        setErrMsg("Something went wrong! Please try again later.");
      }
    })();
  }, [bookId, isIssue, issueId, urlSlug]);

  console.log(detailInfo);
  return (
    <div className="container-fluid details-page">
      <article className="details-header">
        <section className="details-img-container">
          <figure>
            {/* Use flex basis of 20%, flex-grow 1 and flex-shrink 1 */}
            {/* https://developer.mozilla.org/en-US/docs/Web/CSS/flex */}
          </figure>
        </section>
        <section className="detail-description">
          {/* Use flex basis of 70%, flex-grow 1 and flex-shrink 1 */}
        </section>
      </article>
    </div>
  );
};
export default Details;
