import React, { Redirect } from "react-router-dom";
import MetaTags from "../MetaTags";
import "./comic-list.scss";

const ComicList = () => {
  return (
    <>
      <MetaTags title="Bluestone Comics | Comic List" description="">
        <meta name="robots" content="noindex, nofollow" />
      </MetaTags>
      <Redirect to="/page-not-found" />
      <div className="container-fluid comic-list-page min-vh100">
        <div className="row">
          <h2>Comic List</h2>
        </div>
      </div>
    </>
  );
};
export default ComicList;
