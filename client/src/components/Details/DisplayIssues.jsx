import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import moment from "moment";
import { getIssues } from "../../services";

const DisplayIssues = ({ isIssue, urlSlug, bookId }) => {
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
      <Link
        to="#"
        key={nanoid()}
        className="row issues-list-table-item desc-detail link-as-normal"
      >
        <div className="col left-col desc-detail bold">{title}</div>
        <div className="col mid-col desc-detail bold">
          Issue#:&nbsp;{issueNumber}
        </div>
        <div className="col right-col desc-detail bold">
          {moment(dateCreated).format("MMMM D, YYYY")}
        </div>
      </Link>
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
