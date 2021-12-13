import React, { useEffect, useState } from "react";
import { getAllSubscriberedTo } from "../../../services";
import "../subscription.scss";

const Subscribed = ({ profilePageUser }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [allSubscribedList, setAllSubscribedList] = useState([]);
  const { username, id } = profilePageUser;

  useEffect(() => {
    async function getAllSubscriberedToAPI() {
      try {
        const { subscribedTo } = await (
          await getAllSubscriberedTo(id, page)
        ).data;
        setAllSubscribedList(subscribedTo);
      } catch (err) {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }

    getAllSubscriberedToAPI();
  }, [id]);

  const renderAllSubscribedList = allSubscribedList.map((subscriber) => (
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
  ));

  useEffect(() => {
    console.log("all Subscribed to user.", allSubscribedList);
  }, [allSubscribedList]);

  return (
    <>
      <section className="subscription container-fluid">
        <ul className="display-work-grid subscription-list col-sm-2 col-5">
          {renderAllSubscribedList}
          {/* <li className="subscription-list-item grid-list-item"><div className="grid-image-container"><img className="subscription-profile-img grid-image" src="https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg" alt="supercookie"/></div><div className="grid-info-box subscription-username"><div className="grid-info-box-header">WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW</div></div></li>
          <li className="subscription-list-item grid-list-item"><div className="grid-image-container"><img className="subscription-profile-img grid-image" src="https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg" alt="supercookie"/></div><div className="grid-info-box subscription-username"><div className="grid-info-box-header">supercookie</div></div></li>
          <li className="subscription-list-item grid-list-item"><div className="grid-image-container"><img className="subscription-profile-img grid-image" src="https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg" alt="supercookie"/></div><div className="grid-info-box subscription-username"><div className="grid-info-box-header">supercookie</div></div></li>
          <li className="subscription-list-item grid-list-item"><div className="grid-image-container"><img className="subscription-profile-img grid-image" src="https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg" alt="supercookie"/></div><div className="grid-info-box subscription-username"><div className="grid-info-box-header">supercookie</div></div></li>
          <li className="subscription-list-item grid-list-item"><div className="grid-image-container"><img className="subscription-profile-img grid-image" src="https://bluestone-defaults.s3.us-east-2.amazonaws.com/profile-pic.jpeg" alt="supercookie"/></div><div className="grid-info-box subscription-username"><div className="grid-info-box-header">supercookie</div></div></li> */}
        </ul>
      </section>
    </>
  );
};

export default Subscribed;
