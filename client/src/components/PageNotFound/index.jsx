import React from "react";
import { Link } from "react-router-dom";
import MetaTags from "../MetaTags";
import "./page-not-found.scss";

const PageNotFound = () => {
  return (
    <>
      <MetaTags
        title="Bluestone Comics | Page Not Found"
        description="The page you are looking for was not found!"
      >
        <meta name="robots" content="noindex, nofollow" />
      </MetaTags>
      <div className="container not-found-page min-vh100">
        <h1 className="header">404: Uh-Oh! Page Not Found!</h1>
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
    </>
  );
};
export default PageNotFound;
