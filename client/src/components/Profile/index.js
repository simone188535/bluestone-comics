import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { SearchServices } from '../../services';
import './profile.scss';

// https://www.google.com/search?q=profile+page+examples&tbm=isch&ved=2ahUKEwiHqYjq8pfuAhUWGs0KHX0JDK8Q2-cCegQIABAA&oq=profile+page+ex&gs_lcp=CgNpbWcQARgAMgIIADIGCAAQBRAeMgYIABAFEB4yBggAEAUQHjIGCAAQBRAeMgYIABAFEB4yBggAEAUQHjIGCAAQBRAeMgYIABAFEB4yBggAEAgQHjoECAAQQ1CjxxZYquUWYLTuFmgAcAB4AIABeIgBrQKSAQMyLjGYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=iV_-X8fAB5a0tAb9krD4Cg&bih=610&biw=1191&rlz=1C5CHFA_enUS873US873#imgrc=H1KWibQNaM5UGM
// https://codepen.io/Lima_Hammoud_/pen/WBYYQZ
// https://codepen.io/creativetim/pen/mzVQrP
// https://uicookies.com/bootstrap-profile-page/
const Profile = () => {
    let { username } = useParams();
    // Should be an object
    const [profilePageUser, setProfilePageUser] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    // const [currentUsername, setCurrentUsername] = useState('');
    // const { isAuthenticated, currentUser, isFetching } = useSelector(state => ({
    //     isAuthenticated: state.auth.isAuthenticated,
    //     currentUser: state.auth.user,
    //     isFetching: state.auth.isFetching
    // }));

    const fetchProfileUser = async () => {
        try {
            const res = await SearchServices.searchUser(username);

            if (errorMessage) {
                setErrorMessage('');
            }

            setProfilePageUser(res.data.users);
        } catch (err) {
            setErrorMessage(err.response.data.message);
        }
    }

    useEffect(() => {
        fetchProfileUser();
      });

      useEffect(() => {
        console.log('profilePageUser', profilePageUser);
      }, [profilePageUser]);
    

    return (
        <div className="container-fluid profile-page">
            <div className="row">
                {/* <h2>Profile</h2> */}
                <img />
            </div>
        </div>
    );
}
export default Profile;