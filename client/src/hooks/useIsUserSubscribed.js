import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { checkSubscription } from "../services";

function useIsUserSubscribed(providedUserId) {
  const [userIsSubscribed, setuserIsSubscribed] = useState(false);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!currentUserId || !providedUserId) return;

    async function fetchCheckSubscriptionData() {
      // const res = await checkSubscription(providedUserId);
      // add try catch!!!!
      console.log("res ", await checkSubscription(providedUserId));
      // if an error is returned
      // if (!res) return;

      // if
    }

    fetchCheckSubscriptionData();
    // setBelongsToUser(currentUserId === providedUserId);
  }, [providedUserId, currentUserId]);
  // return belongsToUser;
}

export default useIsUserSubscribed;
