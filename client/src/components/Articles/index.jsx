import React from "react";
import ArticleItems from "../CommonUI/ArticleItems";
import "./articles.scss";

const Articles = () => {
  return (
    <div className="container-fluid articles-page min-vh100">
      <main className="articles-container">
        <ArticleItems articleList={[]} />
      </main>
    </div>
  );
};
export default Articles;
