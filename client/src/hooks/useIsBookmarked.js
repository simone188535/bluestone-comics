import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getBookmark } from "../services";

// this hook checks if the current user has a bookmark for the providedBookId
function useIsBookmarked() {
  const [isBookmarked, setIsBookmarked] = useState(null);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const isBookmarkedCB = useCallback(
    async (providedBookId) => {
      if (!currentUserId || !providedBookId) return;

      try {
        const {
          data: {
            bookmark: { book_id: bookId },
          },
        } = await getBookmark(providedBookId);

        setIsBookmarked(!!bookId);
      } catch (err) {
        setIsBookmarked(false);
      }
    },
    [currentUserId]
  );

  return [isBookmarked, isBookmarkedCB];
}

export default useIsBookmarked;
