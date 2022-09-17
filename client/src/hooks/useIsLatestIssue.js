import { useState, useEffect } from "react";
import { getIssues } from "../services";

function useIsLatestIssue(urlSlug, bookId, IssueNum) {
  const [isLatestIssue, setIsLatestIssue] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { issueTotal },
        } = await getIssues(urlSlug, bookId);

        setIsLatestIssue(issueTotal === IssueNum);
      } catch (err) {
        setIsLatestIssue(null);
      }
    })();
  }, [IssueNum, bookId, urlSlug]);

  return isLatestIssue;
}

export default useIsLatestIssue;
