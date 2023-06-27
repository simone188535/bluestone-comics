import React from "react";
import "./article-items.scss";

const ArticleItems = ({ articleList }) => {
  return articleList?.map(({ header, desc, date, imgSrc, alt }) => (
    <article className="article-items">
      <section className="article-body">
        <h2 className="header">{header}</h2>
        {desc && <section className="desc">{desc}</section>}
        {date && <div className="date">{date}</div>}
      </section>
      {imgSrc && alt && (
        <figure>
          <img src={imgSrc} alt={alt} />
        </figure>
      )}
    </article>
  ));
};

export default ArticleItems;
