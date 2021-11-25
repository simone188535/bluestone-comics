import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { checkSubscription } from "../services";

// this hook checks if the current user is subscribed to a particular user(publisherId)
function useIsUserSubscribed() {
  const [userIsSubscribed, setUserIsSubscribed] = useState(null);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const setUserIsSubscribedCB = useCallback(
    async (publisherId) => {
      if (!currentUserId || !publisherId) return;

      try {
        await checkSubscription(publisherId);
        setUserIsSubscribed(true);
      } catch (err) {
        setUserIsSubscribed(false);
      }
    },
    [currentUserId]
  );

  return [userIsSubscribed, setUserIsSubscribedCB];
}

export default useIsUserSubscribed;
