import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { getIssues } from "../../services";
import useIsLatestIssue from "../../hooks/useIsLatestIssue";

const MappedIssue = ({
  title,
  dateCreated,
  issueNumber,
  urlSlug,
  bookId,
  belongsToUser,
}) => {
  const isLatestIssue = useIsLatestIssue(urlSlug, bookId, issueNumber);

  const btnClass = isLatestIssue ? "double-btn" : "";

  return (
    <div className="row issues-list-table-item desc-detail">
      <div className="col left-col desc-detail bold">
        <Link to="#" className="desc-detail link-as-normal">
          {title}
        </Link>
      </div>
      <div className="col mid-col desc-detail bold">
        <Link
          to={`/details/${urlSlug}/book/${bookId}/issue/${issueNumber}`}
          className="desc-detail link-as-normal"
        >
          Issue#:&nbsp;{issueNumber}
        </Link>
      </div>
      {belongsToUser && (
        <>
          <div className="col right-col desc-detail bold">
            {moment(dateCreated).format("MMMM D, YYYY")}
          </div>
          <div className={`col desc-detail user-owned-col ${btnClass}`}>
            <Link
              to={`/edit-upload/${urlSlug}/book/${bookId}/issue/${issueNumber}`}
              className="desc-detail link-as-normal"
            >
              <button
                type="button"
                className="bsc-button user-owned-btn transparent transparent-blue"
              >
                Edit
              </button>
            </Link>
            {isLatestIssue && (
              <button
                type="button"
                className="bsc-button user-owned-btn transparent transparent-red"
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
const DisplayIssues = ({ isIssue, urlSlug, bookId, belongsToUser }) => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    (async () => {
      const issuesRes = await getIssues(urlSlug, bookId);
      const { allIssues } = issuesRes.data;

      setIssues(allIssues);
    })();
  }, [bookId, urlSlug]);

  const displayIssues = issues.map(
    ({ title, issue_number: issueNumber, date_created: dateCreated }) => (
      <MappedIssue
        title={title}
        issueNumber={issueNumber}
        dateCreated={dateCreated}
        urlSlug={urlSlug}
        bookId={bookId}
        belongsToUser={belongsToUser}
        key={`mapped-issue-${dateCreated}`}
      />
    )
  );
  return (
    !isIssue && (
      <section className="extra-info-container mt-50">
        <section className="secondary-info">
          <h2 className="desc-detail bold text-center secondary-header">
            Issues
          </h2>
          <section className="issues-list-table">{displayIssues}</section>
        </section>
      </section>
    )
  );
};

export default DisplayIssues;
