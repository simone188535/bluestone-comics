import { useState, useCallback } from "react";
import { useSelector } from "react-redux";

function useIsBookmarked() {
  const [isBookmarked, setIsBookmarked] = useState(null);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const isBookmarkedCB = useCallback(
    (bookId) => {
      if (!currentUserId || !bookId) return;

      try {
        setIsBookmarked();
      } catch (err) {
        setIsBookmarked(false);
      }
    },
    [currentUserId]
  );

  return [isBookmarked, isBookmarkedCB];
}

export default useIsBookmarked;
