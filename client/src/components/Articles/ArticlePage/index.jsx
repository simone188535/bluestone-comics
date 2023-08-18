import React from "react";
import "./article.scss";

function ArticlePage({ main, aside, className }) {
  const onlyMain = !aside ? "only" : "";
  return (
    <section className={`article-page min-vh100 ${className || ""}`}>
      {main && <main className={`article-main ${onlyMain}`}>{main}</main>}
      {aside && <aside className="article-aside">{aside}</aside>}
    </section>
  );
}

export default ArticlePage;
