import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { checkSubscription } from "../services";

function useIsUserSubscribed(providedUserId) {
  const [userIsSubscribed, setUserIsSubscribed] = useState(null);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!currentUserId || !providedUserId) return;

    async function fetchCheckSubscriptionData() {
      try {
        const res = await checkSubscription(providedUserId);
        console.log("res ", res);
        setUserIsSubscribed(true);
      } catch (err) {
        setUserIsSubscribed(false);
      }
    }

    fetchCheckSubscriptionData();
    // setBelongsToUser(currentUserId === providedUserId);
  }, [providedUserId, currentUserId]);
  return userIsSubscribed;
}

export default useIsUserSubscribed;
