import React from "react";
import { Link } from "react-router-dom";
import "./page-not-found.scss";

const PageNotFound = () => {
  return (
    <div className="container not-found-page min-vh100">
      <h2 className="header">Page Not Found!</h2>
      <p className="desc">
        Looks like you entered a broken link or entered a URL that doesn&#39;t
        exist on this site.
      </p>
      <p className="desc">
        <Link to="/" className="back-to-home-link">
          Back to our site
        </Link>
      </p>
    </div>
  );
};
export default PageNotFound;
