import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function useIsUserSubscribed(providedUserId) {
  // const [belongsToUser, setBelongsToUser] = useState(null);
  // const currentUserId = useSelector((state) => state.auth.user?.id);
  // useEffect(() => {
  //   if (!currentUserId || !providedUserId) return;
  //   setBelongsToUser(currentUserId === providedUserId);
  // }, [currentUserId, providedUserId]);
  // return belongsToUser;
}

export default useIsUserSubscribed;
