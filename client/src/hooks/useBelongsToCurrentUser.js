import { useState, useCallback } from "react";
import { useSelector } from "react-redux";

function useBelongsToCurrentUser() {
  const [belongsToUser, setBelongsToUser] = useState(null);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const setBelongsToUserCB = useCallback(
    (providedUserId) => {
      if (!currentUserId || !providedUserId) return;

      setBelongsToUser(currentUserId === providedUserId);
    },
    [currentUserId]
  );

  return [belongsToUser, setBelongsToUserCB];
}

export default useBelongsToCurrentUser;
