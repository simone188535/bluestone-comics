import React from "react";
import MetaTags from "../MetaTags";
import "./comic-list.scss";

const ComicList = () => {
  return (
    <>
      <MetaTags title="Bluestone Comics | Comic List" description="">
        <meta name="robots" content="noindex, nofollow" />
      </MetaTags>
      <div className="container-fluid comic-list-page min-vh100">
        <div className="row">
          <h2>Comic List</h2>
        </div>
      </div>
    </>
  );
};
export default ComicList;
