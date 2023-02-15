import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

const IssuePaginationBtn = ({ children, btnProps, linkProps, disabled }) => {
  // console.log(disabled);

  // show a link if the button is not disabled and a link is present
  const conditionalLink =
    !disabled && linkProps?.to ? (
      <Link {...linkProps}>{children}</Link>
    ) : (
      children
    );

  // add disabled className to btnProps when the button is disabled
  const buttonProps = disabled
    ? { ...btnProps, className: `${btnProps.className} disabled` }
    : btnProps;

  return (
    <button type="button" {...buttonProps}>
      {conditionalLink}
    </button>
  );
};

const IssuePagination = ({ setDeleteErr }) => {
  const { urlSlug, bookId, issueNumber } = useParams();
  const [totalIssue, setTotalIssue] = useState(null);
  const [issuePagination, setIssuePagination] = useState({
    firstIssueNum: null,
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

        setTotalIssue(issueTotal);
      })();
    } catch (err) {
      setDeleteErr(true);
    }
  }, [bookId, issueNumber, setDeleteErr, urlSlug]);

  // if a issueNumber is present use it to set state in issuePagination
  useEffect(() => {
    if (issueNumber) {
      const issueNum = Number(issueNumber);
      setIssuePagination((prevState) => ({
        ...prevState,
        /*
          if the current page number equals one, this should be null in order to disable the button
          when the user is already on the first issue, else it should be one
        */
        firstIssueNum: issueNum !== 1 ? 1 : null,
        /* 
        prevIssueNum should never be less than 1 (because there are no issues  
        with issue numbers lower than 1), if the value is less than 1, prevIssueNum 
        should be null, this indicates the user is already on the first issue and there
        are no more prev issues
        */
        prevIssueNum: issueNum - 1 > 0 ? issueNum - 1 : null,
        /*
          nextIssueNum should never be greater than totalIssue, if it is
          totalIssue should be null, this indicates the user is already
          on the most recent issue
        */
        nextIssueNum: issueNum + 1 <= totalIssue ? issueNum + 1 : null,

        /* 
          if the current issueNumber is not on the latest issue (totalIssue),
          then return totalIssue, if the current issueNumber is on the lastest issue,
          lastIssueNum should be null, this indicates the user is already on the latest
          issue 
        */
        lastIssueNum: issueNum !== totalIssue ? totalIssue : null,
      }));
    }
  }, [issueNumber, totalIssue]);

  return (
    <section className="read-nav-sticky-footer">
      <div className="control-panel">
        <IssuePaginationBtn
          disabled={!issuePagination.firstIssueNum}
          btnProps={{ title: "First Issue", className: "control-panel-btn" }}
          linkProps={{
            to: `/read/${urlSlug}/book/${bookId}/issue/${issuePagination.firstIssueNum}`,
            className: "control-panel-btn-link",
          }}
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
          <span className="control-panel-btn-text">First</span>
        </IssuePaginationBtn>
        <IssuePaginationBtn
          disabled={!issuePagination.prevIssueNum}
          btnProps={{ title: "Prev Issue", className: "control-panel-btn" }}
          linkProps={{
            to: `/read/${urlSlug}/book/${bookId}/issue/${issuePagination.prevIssueNum}`,
            className: "control-panel-btn-link",
          }}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
          <span className="control-panel-btn-text">Prev</span>
        </IssuePaginationBtn>
        <IssuePaginationBtn
          disabled={false}
          btnProps={{
            title: "Issue details",
            className:
              "bsc-button transparent transparent-black control-panel-btn center-btn",
          }}
          linkProps={{
            to: `/details/${urlSlug}/book/${bookId}/issue/${issueNumber}`,
            className: "control-panel-btn-link center-btn-text",
          }}
        >
          Issue {`${issueNumber}`}
        </IssuePaginationBtn>
        <IssuePaginationBtn
          disabled={!issuePagination.nextIssueNum}
          btnProps={{ title: "Next Issue", className: "control-panel-btn" }}
          linkProps={{
            to: `/read/${urlSlug}/book/${bookId}/issue/${issuePagination.nextIssueNum}`,
            className: "control-panel-btn-link",
          }}
        >
          <span className="control-panel-btn-text">Next</span>
          <FontAwesomeIcon icon={faAngleRight} />
        </IssuePaginationBtn>
        <IssuePaginationBtn
          disabled={!issuePagination.lastIssueNum}
          btnProps={{ title: "Latest Issue", className: "control-panel-btn" }}
          linkProps={{
            to: `/read/${urlSlug}/book/${bookId}/issue/${totalIssue}`,
            className: "control-panel-btn-link",
          }}
        >
          <span className="control-panel-btn-text">Last</span>
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </IssuePaginationBtn>
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
