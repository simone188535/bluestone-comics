import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { checkSubscription } from "../services";

// this hook checks if the current user is subscribed to a particular user(publisherId)
function useIsUserSubscribed(publisherId) {
  const [userIsSubscribed, setUserIsSubscribed] = useState(null);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!currentUserId || !publisherId) return;

    async function fetchCheckSubscriptionData() {
      try {
        const res = await checkSubscription(publisherId);
        console.log("res ", res);
        setUserIsSubscribed(true);
      } catch (err) {
        setUserIsSubscribed(false);
      }
    }

    fetchCheckSubscriptionData();
  }, [publisherId, currentUserId]);

  return userIsSubscribed;
}

export default useIsUserSubscribed;
