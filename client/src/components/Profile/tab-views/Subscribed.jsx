import React, { useEffect, useState, useRef, useCallback } from "react";
import { getAllSubscriberedTo } from "../../../services";
import ErrorMessage from "../../CommonUI/ErrorMessage";
import LoadingSpinner from "../../CommonUI/LoadingSpinner";
import abbreviateNumber from "../../../utils/abbreviateNumber";
import "../subscription.scss";

const Subscribed = ({ profilePageUser }) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allSubscribedList, setAllSubscribedList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef();
  const lastSubElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // console.log("Visible");
          setPage((prevPageNum) => prevPageNum + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [loading, hasMore]
  );
  const { id } = profilePageUser;

  useEffect(() => {
    async function getAllSubscriberedToAPI() {
      setLoading(true);
      try {
        setErrorMessage(false);
        const {
          data: { subscribedTo },
        } = await getAllSubscriberedTo(id, page);

        setAllSubscribedList((prevSubscribedTo) => [
          ...prevSubscribedTo,
          ...subscribedTo,
        ]);

        // console.log('subscribedTo', subscribedTo);
        // console.log('subscribedTo.length', subscribedTo.length);
        setHasMore(subscribedTo.length > 0);
      } catch (err) {
        setErrorMessage(true);
      }
      setLoading(false);
    }

    getAllSubscriberedToAPI();
  }, [id, page]);

  // useEffect(() => {
  //   console.log('page', page);
  // }, [page]);

  // useEffect(() => {
  //   console.log('hasMore', hasMore);
  // }, [hasMore]);

  const renderError = errorMessage ? (
    <ErrorMessage
      errorStatus={errorMessage}
      MessageText="An error occurred. Please try again later."
      className="description-err-msg centered-err-msg"
    />
  ) : null;

  const renderSpinner = loading ? (
    <LoadingSpinner loadingStatus={loading} spinnerType="small" />
  ) : null;

  const renderAllSubscribedList =
    allSubscribedList.length > 0 ? (
      <ul className="display-work-grid subscription-list col-sm-2 col-5">
        {allSubscribedList.map((subscriber, index) => (
          <li
            ref={
              allSubscribedList.length === index + 1
                ? lastSubElementRef
                : undefined
            }
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
            <div className="grid-info-box subscription-general-info">
              <div className="grid-info-box-header">
                {abbreviateNumber(subscriber.subscribers_sub_count)}
              </div>
              <div className="grid-info-box-header">{subscriber.username}</div>
            </div>
          </li>
        ))}
      </ul>
    ) : null;

  // useEffect(() => {
  //   console.log("all Subscribed to user.", allSubscribedList);
  // }, [allSubscribedList]);

  return (
    <>
      <section className="subscription container-fluid">
        {renderAllSubscribedList}
        {renderSpinner}
        {renderError}
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
