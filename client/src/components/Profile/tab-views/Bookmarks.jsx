import React, { useEffect, useState } from "react";
import { getAllBookmarks } from "../../../services";

const Bookmarks = ({ profilePageUserId }) => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    (async () => {
      const {
        data: { bookmark },
      } = await getAllBookmarks(profilePageUserId);
      console.log(bookmark);
      setBookmarks(bookmark);
    })();
  }, [profilePageUserId]);

  useEffect(() => {
    console.log(bookmarks);
  }, [bookmarks]);

  const mappedBookMarks = bookmarks?.map((bookmark) => (
    <li>{bookmark.toString()}</li>
  ));
  const results =
    mappedBookMarks?.length > 0 ? (
      <ul className="display-work-grid col-4">{mappedBookMarks}</ul>
    ) : (
      <p className="text-center description">This user has no bookmarks</p>
    );
  return <section className="container-fluid">{results}</section>;
};

export default Bookmarks;
