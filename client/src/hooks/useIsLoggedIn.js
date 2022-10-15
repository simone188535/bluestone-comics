import { useSelector } from "react-redux";

// returns a boolean telling if the user is logged in
const useIsLoggedIn = () => {
  const currentUserId = useSelector((state) => state.auth.user?.id);

  return [!!currentUserId];
};

export default useIsLoggedIn;
