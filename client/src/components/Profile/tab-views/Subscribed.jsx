import React, { useEffect, useState } from "react";
import { getAllSubscriberedTo } from "../../../services";
import ErrorMessage from "../../CommonUI/ErrorMessage";
import LoadingSpinner from "../../CommonUI/LoadingSpinner";
import "../subscription.scss";

const Subscribed = ({ profilePageUser }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allSubscribedList, setAllSubscribedList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const { username, id } = profilePageUser;

  useEffect(() => {
    async function getAllSubscriberedToAPI() {
      setLoading(true);
      try {
        setErrorMessage(false);
        const { subscribedTo } = await getAllSubscriberedTo(id, page).data;

        setAllSubscribedList((prevSubscribedTo) => [
          ...prevSubscribedTo,
          ...subscribedTo,
        ]);

        setHasMore(subscribedTo.length > 0);
      } catch (err) {
        setErrorMessage(true);
      }
      setLoading(false);
    }

    getAllSubscriberedToAPI();
  }, [id, page]);

  const renderError = errorMessage ? (
    <ErrorMessage
      errorStatus={errorMessage}
      MessageText="An error occurred. Please try again later."
      className="description"
    />
  ) : null;

  const renderSpinner = loading ? (
    <LoadingSpinner loadingStatus={loading} spinnerType="small" />
  ) : null;

  const renderAllSubscribedList =
    allSubscribedList.length > 0 ? (
      <ul className="display-work-grid subscription-list col-sm-2 col-5">
        {allSubscribedList.map((subscriber) => (
          <li
            key={subscriber.publisher_id}
            className="subscription-list-item grid-list-item"
          >
            <div className="grid-image-container">
              <img
                className="subscription-profile-img grid-image"
                src={subscriber.user_photo}
                alt={subscriber.username}
              />
            </div>
            <div className="grid-info-box subscription-username">
              <div className="grid-info-box-header">{subscriber.username}</div>
            </div>
          </li>
        ))}
      </ul>
    ) : null;

  useEffect(() => {
    console.log("all Subscribed to user.");
  }, [allSubscribedList]);

  return (
    <>
      <section className="subscription container-fluid">
        {renderSpinner || renderError || renderAllSubscribedList}
        {/* <li className="subscription-list-item grid-list-item"><div className="grid-image-container"><img className="subscription-profile-img grid-image" src="https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg" alt="supercookie"/></div><div className="grid-info-box subscription-username"><div className="grid-info-box-header">WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW</div></div></li>
          <li className="subscription-list-item grid-list-item"><div className="grid-image-container"><img className="subscription-profile-img grid-image" src="https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg" alt="supercookie"/></div><div className="grid-info-box subscription-username"><div className="grid-info-box-header">supercookie</div></div></li>
          <li className="subscription-list-item grid-list-item"><div className="grid-image-container"><img className="subscription-profile-img grid-image" src="https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg" alt="supercookie"/></div><div className="grid-info-box subscription-username"><div className="grid-info-box-header">supercookie</div></div></li>
          <li className="subscription-list-item grid-list-item"><div className="grid-image-container"><img className="subscription-profile-img grid-image" src="https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg" alt="supercookie"/></div><div className="grid-info-box subscription-username"><div className="grid-info-box-header">supercookie</div></div></li>
          <li className="subscription-list-item grid-list-item"><div className="grid-image-container"><img className="subscription-profile-img grid-image" src="https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg" alt="supercookie"/></div><div className="grid-info-box subscription-username"><div className="grid-info-box-header">supercookie</div></div></li> */}
      </section>
    </>
  );
};

export default Subscribed;
