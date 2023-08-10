import React from "react";
import moment from "moment";
import MetaTags from "../../../MetaTags";

function UploadWorkTutorial({
  // img,
  extraDetails: { date, minRead } = { extraDetails: {} },
}) {
  return (
    <>
      <MetaTags
        title="How to Publish A Comic Book Online: Step-by-Step Guide"
        canonical="https://www.bluestonecomics.com/articles/how-to-publish-your-comic-book-online"
        description=""
      />
      <header className="article-header">
        <h1 className="article-header-title">
          How to Publish A Comic Book Online: Step-by-Step Guide
        </h1>
      </header>
      <section className="article-sub-header">
        <h2 className="article-header-sub-title">
          The &#34;How-To&#34; guide for self-publishing American Comic Books
        </h2>
      </section>
      <section className="article-creation-details">
        <span className="extra-details">
          {date && (
            <span className="extra-details-item date">
              {moment(date).format("MMM D YYYY")}
            </span>
          )}
          {minRead && (
            <span className="extra-details-item min-read">
              {minRead} min read
            </span>
          )}
        </span>
      </section>
      <section className="article-hr-spacing">
        <hr className="article-hr" />
      </section>
      <article className="article-para">
        <figure className="article-figure">
          <img
            src="https://placebear.com/640/360"
            alt="Trulli"
            className="article-figure-img"
          />
          <figcaption className="article-figure-cap">
            Fig.1 - Trulli, Puglia, Italy.
          </figcaption>
        </figure>
        <p className="article-para">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        {/* </article>
      <article className="article-para"> */}
        <p className="article-para">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </article>
    </>
  );
}

// add meta data, mobile styling, figure tag
export default UploadWorkTutorial;
