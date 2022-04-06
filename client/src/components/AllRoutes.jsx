import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";

import Home from "./Home";
import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
import About from "./About";
import Articles from "./Articles";
import ComicList from "./ComicList";
import Contest from "./Contest";
import News from "./News";
import Upload from "./Upload";
import Profile from "./Profile";
import EditProfile from "./Profile/Edit";
import Details from "./Details";
import Read from "./Read";
import ProtectedRoute from "./Auth/ProtectedRoute";

import store from "../store";

import { errorActions } from "../actions/index";

const AllRoutes = () => {
  const location = useLocation();
  // This watches for a route change in location
  useEffect(() => {
    // This clears the global redux error state if the route changes
    store.dispatch(errorActions.removeError());
  }, [location]);
  return (
    <Switch>
      <Route path="/about" component={About} />
      <Route path="/articles" component={Articles} />
      <Route path="/contest" component={Contest} />
      <Route path="/comic-list" component={ComicList} />
      <Route path="/news" component={News} />
      <ProtectedRoute path="/upload" component={Upload} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:resetToken" component={ResetPassword} />
      <ProtectedRoute path="/profile/:username/edit" component={EditProfile} />
      <Route path="/profile/:username" component={Profile} />
      <Route
        path="/details/:urlSlug/book/:bookId/issue/:issueNumber"
        component={Details}
      />
      <Route path="/details/:urlSlug/book/:bookId" component={Details} />
      <Route
        path="/read/:urlSlug/book/:bookId/issue/:issueNumber"
        component={Read}
      />
      <Route path="/read/:urlSlug/book/:bookId" component={Read} />
      <Route path="/" component={Home} />
    </Switch>
  );
};

export default AllRoutes;
