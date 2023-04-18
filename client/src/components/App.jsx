import React from "react";
import store from "../store";
import { authActions } from "../actions";
import { AuthenticationServices } from "../services";
import MetaTags from "./MetaTags";

import Header from "./Header";
import Footer from "./Footer";
import AllRoutes from "./AllRoutes";

// This reauths user if a jwtToken is preset in local storage. Skips login process for a 7 days
const jwtToken = localStorage.getItem("jwtToken");
if (jwtToken) {
  (async () => {
    store.dispatch(authActions.loginRequest());

    const currentUser = await AuthenticationServices.ReAuthUser();

    if (currentUser.status === 200) {
      store.dispatch(authActions.loginSuccess(currentUser.data.user));
    } else {
      // if there is a problem with the current token (like if token is Expired, untrusted...)
      store.dispatch(authActions.logout());
    }
  })();
}

const App = () => (
  <>
    <MetaTags
      title="Bluestone Comics: Make and Read American WebComics"
      canonical="https://www.bluestonecomics.com"
      description="Bluestone Comics is a celebration of American comic books. Upload your own American style comic books. Read all comic books for free. Bring your comics to life."
    />
    <div className="bsc">
      <Header />
      <AllRoutes />
      <Footer />
    </div>
  </>
);

export default App;
