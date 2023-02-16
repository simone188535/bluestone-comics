import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  getUser,
  add,
  remove,
  getTotalSubscribers,
  getTotalSubscribedTo,
} from "../../services";
import useBelongsToCurrentUser from "../../hooks/useBelongsToCurrentUser";
import useIsUserSubscribed from "../../hooks/useIsUserSubscribed";
import Works from "./tab-views/Works-Tabs/Works";
import Bookmarks from "./tab-views/Bookmarks";
import SubscribedOrSubscribedTo from "./tab-views/SubscribedOrSubscribedTo";
import ErrorMessage from "../CommonUI/ErrorMessage";
import abbreviateNumber from "../../utils/abbreviateNumber";
import "./profile.scss";

// https://www.google.com/search?q=profile+page+examples&tbm=isch&ved=2ahUKEwiHqYjq8pfuAhUWGs0KHX0JDK8Q2-cCegQIABAA&oq=profile+page+ex&gs_lcp=CgNpbWcQARgAMgIIADIGCAAQBRAeMgYIABAFEB4yBggAEAUQHjIGCAAQBRAeMgYIABAFEB4yBggAEAUQHjIGCAAQBRAeMgYIABAFEB4yBggAEAgQHjoECAAQQ1CjxxZYquUWYLTuFmgAcAB4AIABeIgBrQKSAQMyLjGYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=iV_-X8fAB5a0tAb9krD4Cg&bih=610&biw=1191&rlz=1C5CHFA_enUS873US873#imgrc=H1KWibQNaM5UGM
// https://codepen.io/Lima_Hammoud_/pen/WBYYQZ
// https://codepen.io/creativetim/pen/mzVQrP
// https://uicookies.com/bootstrap-profile-page/
// https://codepen.io/JavaScriptJunkie/full/jvRGZy
// https://www.dccomics.com/talent/tanya-horie

const SubUnsubBtnOrEdit = ({
  setErrorMessage,
  profilePageUserId,
  username,
}) => {
  const [belongsToUser, setBelongsToUserCB] = useBelongsToCurrentUser();
  const [userIsSubscribed, setUserIsSubscribedCB] = useIsUserSubscribed();
  const [btnIsLoading, setBtnIsLoading] = useState(false);

  useEffect(() => {
    // set initial state to check if this profile page belongsToUser or if userIsSubscribed to it
    setBelongsToUserCB(profilePageUserId);
    setUserIsSubscribedCB(profilePageUserId);
  }, [profilePageUserId, setBelongsToUserCB, setUserIsSubscribedCB]);

  /* 
    This method displays edit, subscribe, and unsubscribe conditionally. if the page belongs 
    to the user, the edit button is shown. If the user is subscribed, the user should see
    unsubscribed button. If the user is not subscribed, the user should see the subscribed 
    button.
  */

  if (!profilePageUserId) return null;

  let index = null;
  const editSubUnsubBtnVal = [
    {
      btnClass: "transparent transparent-blue",
      btnVal: " Edit",
      btnClick: async () => {
        // go to edit profile page
        window.location = `/profile/${username}/edit`;
      },
    },
    {
      btnClass: "transparent transparent-red",
      btnVal: "Unsubscribe",
      btnClick: async () => {
        // subcribe user
        await remove(profilePageUserId);
        // reset userIsSubscribed for useIsUserSubscribed to update button
        await setUserIsSubscribedCB(profilePageUserId);
      },
    },
    {
      btnClass: "primary primary-round primary-glow",
      btnVal: "Subscribe",
      btnClick: async () => {
        // subscribe user
        await add(profilePageUserId);
        // reset userIsSubscribed for useIsUserSubscribed to update button
        await setUserIsSubscribedCB(profilePageUserId);
      },
    },
  ];

  const displayLoadingOrContent = () => {
    return btnIsLoading ? "Loading..." : editSubUnsubBtnVal[index].btnVal;
  };

  if (belongsToUser) {
    index = 0;
  } else if (userIsSubscribed) {
    index = 1;
  } else if (userIsSubscribed === false) {
    index = 2;
  }

  const btnOnClick = async () => {
    try {
      setBtnIsLoading(true);
      await editSubUnsubBtnVal[index].btnClick();
      setBtnIsLoading(false);
    } catch (err) {
      setErrorMessage(true);
    }
  };

  return index !== null ? (
    <button
      type="button"
      className={`sub-edit-unsub-btn bsc-button ${editSubUnsubBtnVal[index].btnClass}`}
      onClick={btnOnClick}
      disabled={btnIsLoading}
    >
      {displayLoadingOrContent()}
    </button>
  ) : null;
};

const Profile = () => {
  const { username } = useParams();
  const [profilePageUser, setProfilePageUser] = useState({});
  const [errorMessage, setErrorMessage] = useState(false);
  const [generalInfo, setGeneralInfo] = useState({
    views: "",
    subscribers: "",
    subscribedTo: "",
  });

  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const {
          data: { user },
        } = await getUser({ username });

        setErrorMessage(false);
        setProfilePageUser(user);
      } catch (err) {
        setErrorMessage(true);
      }
    };
    fetchProfileUser();
  }, [username]);

  useEffect(() => {
    const fetchGeneralInfo = async () => {
      if (!profilePageUser.id) return;
      try {
        const {
          data: { totalSubscribers },
        } = await getTotalSubscribers(profilePageUser.id);

        const {
          data: { totalSubscribedTo },
        } = await getTotalSubscribedTo(profilePageUser.id);

        setGeneralInfo({
          views: "",
          subscribers: abbreviateNumber(totalSubscribers),
          subscribedTo: abbreviateNumber(totalSubscribedTo),
        });
      } catch (err) {
        setErrorMessage(true);
      }
    };

    fetchGeneralInfo();
  }, [profilePageUser]);

  return (
    <div className="container-fluid profile-page">
      <div
        className="profile-page-header"
        style={{
          backgroundImage: `url(${profilePageUser.background_user_photo})`,
        }}
      >
        <div className="background-overlay">
          <img
            className="profile-pic"
            alt="profile"
            src={profilePageUser.user_photo}
          />
          <h2 className="username-header">{profilePageUser.username}</h2>
          <p className="role">{profilePageUser.role}</p>
          <div className="general-info">
            <div className="general-info-content">
              <h2>WWW.W</h2>
              <p>Views</p>
            </div>
            <div className="general-info-content">
              <h2>{generalInfo.subscribers}</h2>
              <p>Subscribers</p>
            </div>
            <div className="general-info-content">
              <h2>{generalInfo.subscribedTo}</h2>
              <p>Subscribed</p>
            </div>
          </div>
        </div>
      </div>
      <main className="profile-page-body">
        <ErrorMessage
          errorStatus={errorMessage}
          messageText="An error occurred. Please try again later."
          className="description-err-msg centered-err-msg"
        />
        <section className="container subscribe-edit">
          <SubUnsubBtnOrEdit
            setErrorMessage={setErrorMessage}
            profilePageUserId={profilePageUser.id}
            username={username}
          />
        </section>
        <section className="container user-bio">
          <h2 className="title">Bio</h2>
          <p className="description">{profilePageUser.bio}</p>
        </section>
        <section className="user-info">
          <Tabs className="tab-navigation">
            <section className="container">
              <TabList>
                <Tab>Works</Tab>
                <Tab>Bookmarks</Tab>
                <Tab>Subscribers</Tab>
                <Tab>Subscribed</Tab>
                {/* <Tab>Achievements</Tab> */}
              </TabList>
            </section>
            <section className="container-fluid">
              <TabPanel>
                <Works profilePageUser={profilePageUser} />
              </TabPanel>
              <TabPanel>
                <Bookmarks profilePageUserId={profilePageUser.id} />
              </TabPanel>
              <TabPanel>
                <SubscribedOrSubscribedTo
                  profilePageUserId={profilePageUser.id}
                  type="getAllSubscribers"
                />
              </TabPanel>
              <TabPanel>
                <SubscribedOrSubscribedTo
                  profilePageUserId={profilePageUser.id}
                  type="getAllSubscribedTo"
                />
              </TabPanel>
            </section>
          </Tabs>
        </section>
      </main>
    </div>
  );
};
export default Profile;
