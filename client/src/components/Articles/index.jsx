import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ArticleItems from "../CommonUI/ArticleItems";
import Pagination from "../CommonUI/Pagination";
import useCurrentPageResults from "../../hooks/useCurrentPageResults";
import allPageData from "./article-details";
import CONSTANTS from "../../utils/Constants";
import "./articles.scss";

const { ARTICLE_PAGINATION_LIMIT } = CONSTANTS;

const Articles = () => {
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(null);

  const setPage = (page) => {
    setCurrentPage(page);
    history.push(`/articles?page=${page}`);
  };

  const currentResultsDisplayed = useCurrentPageResults(
    currentPage,
    allPageData,
    ARTICLE_PAGINATION_LIMIT
  );

  useEffect(() => {
    // set initial page number
    const urlParams = new URLSearchParams(window.location.search);
    const initialPageNumber = urlParams.get("page") || 1;

    setCurrentPage(initialPageNumber);
  }, []);

  return (
    <div className="container-fluid articles-page min-vh100">
      <main className="articles-container">
        <section className="all-articles">
          <ArticleItems articleList={currentResultsDisplayed} />
        </section>
        <section className="article-pagination">
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={allPageData.length}
            pageSize={ARTICLE_PAGINATION_LIMIT}
            onPageChange={setPage}
            alwaysShow={false}
          />
        </section>
      </main>
    </div>
  );
};
export default Articles;
