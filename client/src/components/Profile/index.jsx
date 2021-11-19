import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { getUser, add, remove } from "../../services";
import useBelongsToCurrentUser from "../../hooks/useBelongsToCurrentUser";
import useIsUserSubscribed from "../../hooks/useIsUserSubscribed";
import Works from "./tab-views/Works-Tabs/Works";
import Bookmarks from "./tab-views/Bookmarks";
import Subscribed from "./tab-views/Subscribed";
import Subscribers from "./tab-views/Subscribers";
import "./profile.scss";

// https://www.google.com/search?q=profile+page+examples&tbm=isch&ved=2ahUKEwiHqYjq8pfuAhUWGs0KHX0JDK8Q2-cCegQIABAA&oq=profile+page+ex&gs_lcp=CgNpbWcQARgAMgIIADIGCAAQBRAeMgYIABAFEB4yBggAEAUQHjIGCAAQBRAeMgYIABAFEB4yBggAEAUQHjIGCAAQBRAeMgYIABAFEB4yBggAEAgQHjoECAAQQ1CjxxZYquUWYLTuFmgAcAB4AIABeIgBrQKSAQMyLjGYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=iV_-X8fAB5a0tAb9krD4Cg&bih=610&biw=1191&rlz=1C5CHFA_enUS873US873#imgrc=H1KWibQNaM5UGM
// https://codepen.io/Lima_Hammoud_/pen/WBYYQZ
// https://codepen.io/creativetim/pen/mzVQrP
// https://uicookies.com/bootstrap-profile-page/
// https://codepen.io/JavaScriptJunkie/full/jvRGZy
// https://www.dccomics.com/talent/tanya-horie
const Profile = () => {
  const { username } = useParams();
  // Should be an object
  const [profilePageUser, setProfilePageUser] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [currentUsername, setCurrentUsername] = useState('');
  // const { isAuthenticated, currentUser, isFetching } = useSelector(state => ({
  //     isAuthenticated: state.auth.isAuthenticated,
  //     currentUser: state.auth.user,
  //     isFetching: state.auth.isFetching
  // }));

  // a helper function will be needed to format profile numbers: https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900

  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const res = await getUser({ username });

        // if (errorMessage) {
        setErrorMessage("");
        // }

        setProfilePageUser(res.data.user);
      } catch (err) {
        // setErrorMessage(err.response.data.message);
        // setErrorMessage("An error occurred. Please try again later.");
        setErrorMessage(true);
      }
    };
    fetchProfileUser();
  }, [username]);

  // useEffect(() => {
  //     console.log('profilePageUser', profilePageUser);
  // }, [profilePageUser]);
  const belongsToCurrentUser = useBelongsToCurrentUser(profilePageUser.id);
  const isUserSubscribedToProfilePageUser = useIsUserSubscribed(
    profilePageUser.id
  );

  /* 
    This method displays edit, subscribe, and unsubscribe conditionally. if the page belongs 
    to the user, the edit button is shown. If the user is subscribed, the user should see
    unsubscribed button. If the user is not subscribed, the user should see the subscribed 
    button.
  */
  const showEditSubOrUnsubBtn = () => {
    if (!profilePageUser) return null;

    let index = null;
    const editSubUnsubBtnVal = [
      {
        btnClass: "transparent transparent-blue",
        btnVal: " Edit",
        btnClick: async () => {
          try {
            setIsLoading(true);

            // const res = await getUser({ username });
            console.log("Edit");
            setIsLoading(false);
          } catch (err) {
            setErrorMessage(true);
          }
        },
      },
      {
        btnClass: "transparent transparent-red",
        btnVal: "Unsubscribe",
        btnClick: async () => {
          try {
            setIsLoading(true);
            console.log("unsubscribe");
            const res = await remove(profilePageUser.id);
            setIsLoading(false);
          } catch (err) {
            setErrorMessage(true);
          }
        },
      },
      {
        btnClass: "primary primary-round primary-glow",
        btnVal: "Subscribe",
        btnClick: async () => {
          try {
            setIsLoading(true);
            console.log("Subscribe");
            const res = await add(profilePageUser.id);
            setIsLoading(false);
          } catch (err) {
            setErrorMessage(true);
          }
        },
      },
    ];

    if (belongsToCurrentUser) {
      index = 0;
    } else if (isUserSubscribedToProfilePageUser) {
      index = 1;
    } else if (isUserSubscribedToProfilePageUser === false) {
      index = 2;
    }

    const showBtnOrNull =
      index !== null ? (
        <button
          type="button"
          className={`sub-edit-unsub-btn bsc-button ${editSubUnsubBtnVal[index].btnClass}`}
          onClick={editSubUnsubBtnVal[index].btnClick}
        >
          {editSubUnsubBtnVal[index].btnVal}
        </button>
      ) : (
        <></>
      );

    return showBtnOrNull;
  };

   // const editButtonIfWorkBelongsToUser = belongsToCurrentUser ? (
  //   <>
  //     <Link to="#">
  //       <button
  //         type="button"
  //         className="sub-edit-unsub-btn bsc-button transparent transparent-blue "
  //       >
  //         Edit
  //       </button>
  //     </Link>
  //     <Link to="#">
  //       <button
  //         type="button"
  //         className="sub-edit-unsub-btn bsc-button primary primary-round primary-glow"
  //       >
  //         Subscribe
  //       </button>
  //     </Link>
  //     <Link to="#">
  //       <button
  //         type="button"
  //         className="sub-edit-unsub-btn bsc-button transparent transparent-red"
  //       >
  //         Unsubscribe
  //       </button>
  //     </Link>
  //   </>
  // ) : null;
  
  return (
    <div className="container-fluid profile-page">
      <div className="profile-page-header">
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
              <h2>WWW.W</h2>
              <p>Subscribers</p>
            </div>
            <div className="general-info-content">
              <h2>WWW.W</h2>
              <p>Subscribed</p>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-page-body">
        {/* SET ERROR MESSAGE HERE */}
        <section className="container subscribe-edit">
          {showEditSubOrUnsubBtn()}
        </section>
        <section className="container user-bio">
          <h2 className="title">Bio</h2>
          <p className="description">{profilePageUser.bio}</p>
        </section>
        <section className="user-info">
          <Tabs className="tab-navigation">
            <div className="container">
              <TabList>
                <Tab>Works</Tab>
                <Tab>Bookmarks</Tab>
                <Tab>Subscribers</Tab>
                <Tab>Subscribed</Tab>
                {/* <Tab>Achievements</Tab> */}
              </TabList>
            </div>
            <div className="container-fluid">
              <TabPanel>
                <Works profilePageUser={profilePageUser} />
              </TabPanel>
              <TabPanel>
                <Bookmarks profilePageUser={profilePageUser} />
              </TabPanel>
              <TabPanel>
                <Subscribers profilePageUser={profilePageUser} />
              </TabPanel>
              <TabPanel>
                <Subscribed profilePageUser={profilePageUser} />
              </TabPanel>
            </div>
          </Tabs>
        </section>
      </div>
    </div>
  );
};
export default Profile;
