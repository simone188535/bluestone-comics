import React from "react";
import moment from "moment";

function ArticleHeader({
  metaData,
  headerText,
  subheaderText = "",
  extraDetails: { date, minRead } = { extraDetails: {} },
  pageImg: { src, alt } = { pageImg: {} },
}) {
  return (
    <>
      {metaData}
      <header className="article-header">
        <h1 className="article-header-title">{headerText}</h1>
      </header>
      {subheaderText && (
        <section className="article-sub-header">
          <h2 className="article-header-sub-title">{subheaderText}</h2>
        </section>
      )}
      {(date || minRead) && (
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
      )}
      <section className="article-hr-spacing">
        <hr className="article-hr" />
      </section>
      {(src || alt) && (
        <article className="article-para">
          <figure className="article-figure mb-md">
            <img
              src={src}
              alt={alt}
              className="article-figure-img"
              width="100%"
              height="auto"
            />
          </figure>
        </article>
      )}
    </>
  );
}

export default ArticleHeader;
