import React from "react";

function ArticlePage({ main, aside }) {
  return (
    <section className="article min-vh100">
      {main && <main className="article-main">{main}</main>}
      {aside && <aside className="article-aside">{aside}</aside>}
    </section>
  );
}

export default ArticlePage;
