import React from "react";
import "./article-items.scss";

const ArticleItems = ({ articleList }) => {
  const articles =
    articleList?.length > 0
      ? articleList.map((item) => {
          const { key, header, desc, date, imgSrc, alt } = item;

          return (
            <article className="article-items" key={`article-items-${key}`}>
              {imgSrc && alt && (
                <figure className="article-img-wrapper">
                  <img src={imgSrc} alt={alt} className="article-img" />
                </figure>
              )}
              <section className="article-body">
                <h2 className="header">{header}</h2>
                {desc && <section className="desc">{desc}</section>}
                {date && <div className="date">{date}</div>}
              </section>
            </article>
          );
        })
      : null;

  return articles;
};

export default ArticleItems;
