import React from "react";
import moment from "moment";
import "./article-items.scss";

const ArticleItems = ({ articleList }) => {
  const articles =
    articleList?.length > 0
      ? articleList.map((item) => {
          const {
            key,
            header,
            desc,
            img: { src, alt },
            extraDetails: { date, articleType, minRead },
          } = item;

          return (
            <article className="article-items" key={`article-items-${key}`}>
              {src && alt && (
                <figure className="article-img-wrapper">
                  <img src={src} alt={alt} className="article-img" />
                </figure>
              )}
              <section className="article-body">
                <section className="content-wrapper">
                  <h2 className="header">{header}</h2>
                  {desc && <section className="desc">{desc}</section>}
                  <div className="extra-details">
                    <span className="left-details">
                      {date && (
                        <span className="left-details-item date">
                          {moment(date).format("MMM D")}
                        </span>
                      )}
                      {minRead && (
                        <span className="left-details-item min-read">
                          {minRead} min read
                        </span>
                      )}
                    </span>
                    <span className="right-details">
                      {articleType && (
                        <span className="article-type">{articleType}</span>
                      )}
                    </span>
                  </div>
                </section>
              </section>
            </article>
          );
        })
      : null;

  return articles;
};

export default ArticleItems;
