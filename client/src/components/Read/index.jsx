import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleRight,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { getIssue, getIssues } from "../../services";
import ErrMsg from "../CommonUI/ErrorMessage";
import "./read.scss";

const IssuePagination = ({ setDeleteErr }) => {
  const { urlSlug, bookId, issueNumber } = useParams();
  const [issuePagination, setIssuePagination] = useState({
    firstIssueNum: 1,
    prevIssueNum: null,
    nextIssueNum: null,
    lastIssueNum: null,
  });

  // get the total number of issues and use it to set state in lastIssueNum
  useEffect(() => {
    try {
      (async () => {
        const {
          data: { issueTotal },
        } = await getIssues(urlSlug, bookId, issueNumber);

        setIssuePagination((prevState) => ({
          ...prevState,
          lastIssueNum: issueTotal,
        }));
      })();
    } catch (err) {
      setDeleteErr(true);
    }
  }, [bookId, issueNumber, setDeleteErr, urlSlug]);

  // if a issueNumber is present use it to set state in prevIssueNum, nextIssueNum
  useEffect(() => {
    if (issueNumber) {
      const issueNum = Number(issueNumber);
      setIssuePagination((prevState) => ({
        ...prevState,
        /* prevIssueNum should never be less than 1 (because there are no issues  
        with issue numbers lower than 1), if the value is less than 1, prevIssueNum 
        should be null
        */
        prevIssueNum: issueNum - 1 > 0 ? issueNum - 1 : null,
        /*
          nextIssueNum should never be greater than lastIssueNum, if it is
          lastIssueNum should be null
        */
        nextIssueNum:
          issueNum + 1 <= issuePagination.lastIssueNum ? issueNum + 1 : null,
      }));
    }
  }, [issueNumber, issuePagination.lastIssueNum]);

  useEffect(() => {
    console.log(issuePagination);
  }, [issuePagination]);

  return (
    <section className="read-nav-sticky-footer">
      <div className="control-panel">
        <span className="control-panel-btn">
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </span>
        <span className="control-panel-btn">
          <FontAwesomeIcon icon={faAngleLeft} />
          {` `}
          Prev
        </span>
        <span className="control-panel-btn center-btn">
          Issue {`${issueNumber}`}
        </span>
        <span className="control-panel-btn">
          Next {` `} <FontAwesomeIcon icon={faAngleRight} />
        </span>
        <span className="control-panel-btn">
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </span>
        {/* <div>??</div>
        <div>%</div> */}
      </div>
    </section>
  );
};

const Read = () => {
  const [pages, setPages] = useState([]);
  const [deleteErr, setDeleteErr] = useState(false);
  const { urlSlug, bookId, issueNumber } = useParams();
  useEffect(() => {
    try {
      (async () => {
        const {
          data: { issueAssets },
        } = await getIssue(urlSlug, bookId, issueNumber);
        setPages(issueAssets);
      })();
    } catch (err) {
      setDeleteErr(true);
    }
  }, [bookId, issueNumber, urlSlug]);
  return (
    <main className="container-fluid read-page min-vh100">
      <div className="row">
        {/* <h2>Read</h2> */}
        {!deleteErr ? (
          <ul className="issue-page-list-container">
            {pages.map(({ id, page_number: pageNum, photo_url: photoUrl }) => (
              <li className="issue-page" key={`issue-page-${id}`}>
                <img
                  src={photoUrl}
                  className="issue-page-img"
                  alt={`issue-page-${pageNum}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="read-err-msg text-center">
            <ErrMsg
              errorStatus={deleteErr}
              messageText="An Error occurred. Please try again later."
            />
          </p>
        )}
      </div>
      <IssuePagination setDeleteErr={setDeleteErr} />
    </main>
  );
};
export default Read;
