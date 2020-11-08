import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import store from '../store';
import { authActions } from '../actions';
import { AuthenticationServices } from '../services';

import Header from './Header';
import Footer from './Footer';
import AllRoutes from './AllRoutes';
import Modal from './CommonUI/Modal';

// This reauths user if a jwtToken is preset in local storage. Skips login process for a 7 days
const jwtToken = localStorage.getItem('jwtToken');
if (jwtToken) {
    (async () => {
        store.dispatch(authActions.loginRequest());
        const currentUser = await AuthenticationServices.ReAuthUser(jwtToken);
        // console.log('current', currentUser);
        if (currentUser.status === 200) {
            return store.dispatch(authActions.loginSuccess(currentUser.data.data.user));
        }
    })();
} // this may need an else statement to clear store  if users jwt token expires while in use. 
const openModel = () => {
    console.log('clicked Modal');
}
const App = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    return (
        <Router>
            <div className="bsc">
                <Header />
                <AllRoutes />
                <Footer />
                <button onClick={()=> setModalIsOpen(true)}>open Modal</button>
                <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
                    <h1>Modal Header</h1>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </Modal>
            </div>
        </Router>
    );
}

export default App;