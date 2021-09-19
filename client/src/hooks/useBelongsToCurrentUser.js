import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function useBelongsToCurrentUser(providedUserId) {
  const [belongsToUser, setBelongsToUser] = useState(null);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    setBelongsToUser(currentUserId === providedUserId);
  }, [providedUserId]);

  return belongsToUser;
}

export default useBelongsToCurrentUser;
