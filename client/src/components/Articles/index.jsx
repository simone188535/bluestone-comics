import React from "react";
import ArticleItem from "../CommonUI/ArticleItem";
import "./articles.scss";

const Articles = () => {
  return (
    <div className="container-fluid articles-page min-vh100">
      <main className="articles-container">
        <ArticleItem articleList={[]} />
      </main>
    </div>
  );
};
export default Articles;
