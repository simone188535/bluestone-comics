import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBook, getIssue } from "../../services";
import "./details.scss";

const Details = () => {
  const { urlSlug, bookId, issueNumber } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [detailInfo, setDetailInfo] = useState(null);

  // If issueId does not exist then the provided URL and the data on this page is for a book.
  const isIssue = !!issueNumber;

  // console.log({isIssue});

  useEffect(() => {
    (async () => {
      try {
        // create call for getBook or getIssue and set it to state.
        const appropiateAPICall = isIssue
          ? await getIssue(urlSlug, bookId, issueNumber)
          : await getBook(urlSlug, bookId);

        const { book, issue } = appropiateAPICall.data;
        setDetailInfo(book ?? issue);
      } catch (err) {
        setErrMsg("Something went wrong! Please try again later.");
      }
    })();
  }, [bookId, isIssue, issueNumber, urlSlug]);

  console.log(detailInfo);
  return (
    <div className="container-fluid details-page">
      <article className="primary-info">
        <section className="detail-img-container">
          <figure className="detail-img">
            {/* Use flex basis of 30%, flex-grow 1 and flex-shrink 1 */}
            {/* https://developer.mozilla.org/en-US/docs/Web/CSS/flex */}
            Hello
          </figure>
        </section>
        <section className="detail-description">
          {/* Use flex basis of 70%, flex-grow 1 and flex-shrink 1 */}
          World
        </section>
      </article>
    </div>
  );
};
export default Details;
