import React, { useEffect, useState, useRef, useCallback } from "react";
import { getAllSubscribedTo, getAllSubscribers } from "../../../services";
import ErrorMessage from "../../CommonUI/ErrorMessage";
import LoadingSpinner from "../../CommonUI/LoadingSpinner";
import abbreviateNumber from "../../../utils/abbreviateNumber";
import "../subscription.scss";

const SubscribedOrSubscribedTo = ({ profilePageUser, type }) => {
  const { id } = profilePageUser;
  const [errorMessage, setErrorMessage] = useState(false);
  const [pageType, setPageType] = useState(type);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allSubscribedList, setAllSubscribedList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef();

  useEffect(() => {
    setPageType(type);
  }, [type]);

  useEffect(() => {
    async function getAllSubscriptionToAPI() {
      setLoading(true);
      try {
        // Remove Error Message
        setErrorMessage(false);

        // Choose which API call to use
        const appropiateAPICall =
          pageType === "getAllSubscribers"
            ? getAllSubscribers(id, page)
            : getAllSubscribedTo(id, page);

        const {
          data: { subscribedTo, subscribers },
        } = await appropiateAPICall;

        const subscriptionResults = subscribedTo || subscribers;

        setAllSubscribedList((prevSubscribedTo) => [
          ...prevSubscribedTo,
          ...subscriptionResults,
        ]);

        setHasMore(subscriptionResults.length > 0);
      } catch (err) {
        setErrorMessage(true);
      }
      setLoading(false);
    }

    getAllSubscriptionToAPI();
  }, [id, page, pageType]);

  /* 
    This logic controls whether more subscriber data is fetched when the last element of 
    the page is present to the user. This conditionally adds a ref tags to the last li if
    it is visible when the user scrolls.
    https://www.youtube.com/watch?v=NZKUirTtxcg
  */
  const lastSubElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPageNum) => prevPageNum + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

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
                {`${abbreviateNumber(
                  subscriber.subscribers_sub_count
                )} subscribers`}
              </div>
              <div className="grid-info-box-header">{subscriber.username}</div>
            </div>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <>
      <section className="subscription container-fluid">
        {renderAllSubscribedList}
        {renderSpinner}
        {renderError}
      </section>
    </>
  );
};

export default SubscribedOrSubscribedTo;