import React, { useEffect } from "react";
import "../subscription.scss";

const Subscribed = ({ profilePageUser }) => {
  const { username, id } = profilePageUser;

  useEffect(() => {}, []);
  return <div>Subscribed</div>;
};

export default Subscribed;
