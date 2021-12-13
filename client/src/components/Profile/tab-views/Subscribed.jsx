import React, { useEffect, useState } from "react";
import { getAllSubscriberedTo } from "../../../services";
import "../subscription.scss";

const Subscribed = ({ profilePageUser }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [allSubscribedList, setAllSubscribedList] = useState([]);
  const { username, id } = profilePageUser;

  useEffect(() => {
    async function getAllSubscriberedToAPI() {
      try {
        const subbedToUser = await getAllSubscriberedTo(id);
        setAllSubscribedList(subbedToUser);
      } catch (err) {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }

    getAllSubscriberedToAPI();
  }, [id]);

  useEffect(() => {
    console.log("all Subscribed to user.", allSubscribedList);
  }, [allSubscribedList]);

  return (
    <>
      <table className="subscription sub-table container-fluid">
        <tbody className="sub-table-body">
          <tr className="sub-table-row">
            <th className="sub-table-head">Profile</th>
            <th className="sub-table-head">Date subscribed</th>
            <th className="sub-table-head">Subscriber count</th>
          </tr>
          <tr className="sub-table-row">
            <td className="sub-table-data">Alfreds Futterkiste</td>
            <td className="sub-table-data">Maria Anders</td>
            <td className="sub-table-data">Germany</td>
          </tr>
          <tr className="sub-table-row">
            <td className="sub-table-data">Alfreds Futterkiste</td>
            <td className="sub-table-data">Maria Anders</td>
            <td className="sub-table-data">Germany</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Subscribed;
