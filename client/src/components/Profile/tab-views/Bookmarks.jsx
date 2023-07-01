import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { getAllBookmarks } from "../../../services";
import LoadingSpinner from "../../CommonUI/LoadingSpinner";
import Pagination from "../../CommonUI/Pagination";
import useCurrentPageResults from "../../../hooks/useCurrentPageResults";
import CONSTANTS from "../../../utils/Constants";

const { PAGINATION_LIMIT } = CONSTANTS;

const Bookmarks = ({ profilePageUserId }) => {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [errorMessageStatus, setErrorMessageStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingStatus(true);

        const {
          data: { bookmark },
        } = await getAllBookmarks(profilePageUserId);
        setBookmarks(bookmark);

        setLoadingStatus(false);
      } catch (err) {
        setErrorMessageStatus(true);
      }
    })();
  }, [profilePageUserId]);

  const currentResultsDisplayed = useCurrentPageResults(
    currentPage,
    bookmarks,
    PAGINATION_LIMIT
  );
  const setPage = (page) => setCurrentPage(page);

  const mappedBookMarks = currentResultsDisplayed?.map(
    ({
      book_id: bookId,
      book_title: bookTitle,
      url_slug: urlSlug,
      cover_photo: coverPhoto,
      date_created: dateCreated,
    }) => (
      <li className="grid-list-item" key={`bookmark-${bookId}`}>
        <div className="grid-image-container">
          <Link to={`/details/${urlSlug}/book/${bookId}`}>
            <img className="grid-image" src={coverPhoto} alt={bookTitle} />
          </Link>
        </div>
        <div className="grid-info-box">
          <div className="grid-info-box-header-container">
            <h3 className="grid-info-box-header">
              <Link
                to={`/read/${urlSlug}/book/${bookId}/issue/1`}
                className="grid-info-box-header-link"
              >
                {bookTitle}
              </Link>
            </h3>
            <div className="grid-info-box-date-created">
              {moment(dateCreated).format("MMMM D, YYYY")}
            </div>
          </div>
        </div>
      </li>
    )
  );

  const statusOfDataRetrieval = () => {
    if (loadingStatus) {
      return (
        <LoadingSpinner loadingStatus={loadingStatus} spinnerType="large" />
      );
    }

    if (errorMessageStatus) {
      return (
        <p className="text-center description error-message error-text-color">
          This user has no bookmarks
        </p>
      );
    }

    if (bookmarks?.length > 0) {
      return (
        <>
          <div className="filtered-results">
            <ul className="display-work-grid col-4">{mappedBookMarks}</ul>
          </div>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={bookmarks.length}
            pageSize={PAGINATION_LIMIT}
            onPageChange={setPage}
            alwaysShow={false}
          />
        </>
      );
    }

    return (
      <p className="text-center description">This user has no bookmarks</p>
    );
  };
  return (
    <section className="container-fluid">{statusOfDataRetrieval()}</section>
  );
};

export default Bookmarks;
