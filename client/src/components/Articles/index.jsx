import React from "react";
import ArticleItems from "../CommonUI/ArticleItems";
import batmanLarge from "../../assets/homepage/batman-welcome-Large.jpg";
import "./articles.scss";

const Articles = () => {
  return (
    <div className="container-fluid articles-page min-vh100">
      <main className="articles-container">
        <ArticleItems
          articleList={[
            {
              id: 1,
              header: "Header",
              desc: "description",
              date: new Date().toISOString(),
              imgSrc: batmanLarge,
              alt: "placeholder",
            },
          ]}
        />
      </main>
    </div>
  );
};
export default Articles;
