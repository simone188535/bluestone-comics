import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { getAllBookmarks } from "../../../services";

const Bookmarks = ({ profilePageUserId }) => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    (async () => {
      const {
        data: { bookmark },
      } = await getAllBookmarks(profilePageUserId);
      setBookmarks(bookmark);
    })();
  }, [profilePageUserId]);

  useEffect(() => {
    console.log(bookmarks);
  }, [bookmarks]);

  const mappedBookMarks = bookmarks?.map(
    ({
      book_id: bookId,
      username,
      publisher_id: publisherId,
      book_title: bookTitle,
      url_slug: urlSLug,
      cover_photo: coverPhoto,
      description,
      status,
      removed,
      date_created: dateCreated,
    }) => (
      <li className="grid-list-item">
        <div className="grid-image-container">
          <Link to="#">
            <img className="grid-image" src={coverPhoto} alt={bookTitle} />
          </Link>
        </div>
        <div className="grid-info-box">
          <div className="grid-info-box-header-container">
            {/* {showFirstHeaderWithBooksorIssueTitle}
            {showSecondHeaderWithBookTitle} */}
            <div className="grid-info-box-date-created">
              {moment(dateCreated).format("MMMM D, YYYY")}
            </div>
          </div>
        </div>
      </li>
    )
  );
  const results =
    mappedBookMarks?.length > 0 ? (
      <ul className="display-work-grid col-4">{mappedBookMarks}</ul>
    ) : (
      <p className="text-center description">This user has no bookmarks</p>
    );
  return <section className="container-fluid">{results}</section>;
};

export default Bookmarks;
