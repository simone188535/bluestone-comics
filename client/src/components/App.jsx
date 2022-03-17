import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import store from "../store";
import { authActions } from "../actions";
import { AuthenticationServices } from "../services";

import Header from "./Header";
import Footer from "./Footer";
import AllRoutes from "./AllRoutes";

// This reauths user if a jwtToken is preset in local storage. Skips login process for a 7 days
const jwtToken = localStorage.getItem("jwtToken");
if (jwtToken) {
  (async () => {
    store.dispatch(authActions.loginRequest());
    // Use a try catch here for this await, the catch will unset the token on failure. go into the backend and throw an error if decoding fails: https://stackoverflow.com/a/34329947/6195136
    const currentUser = await AuthenticationServices.ReAuthUser();

    if (currentUser.status === 200) {
      return store.dispatch(authActions.loginSuccess(currentUser.data.user));
    }
    // if there is a problem with the current token (like if token is Expired, untrusted...)
    return store.dispatch(authActions.logout());
  })();
}

const App = () => (
  <Router>
    <div className="bsc">
      <Header />
      <AllRoutes />
      <Footer />
    </div>
  </Router>
);

export default App;
