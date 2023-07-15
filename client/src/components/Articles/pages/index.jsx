import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import RouteWithSubRoutes from "../../Routes/RouteWithSubRoutes";
import Articles from "..";

import allPageData from "../article-details";

function AllArticleRoutes() {
  return allPageData.map(({ key, link, pageComp }) => (
    <RouteWithSubRoutes
      key={key}
      path={link}
      component={pageComp}
      routes={{ path: link, component: pageComp }}
    />
  ));
}

function ArticleRoutes() {
  const { path } = useRouteMatch();

  // const allArticleRoutes = allPageData.map(({ key, link, pageComp }) => (
  //   <Route path={`/${link}`} key={key}>
  //     {pageComp}
  //   </Route>
  // ));

  return (
    <Switch>
      <Route exact path={path}>
        <Articles />
      </Route>
      {/* map over all article routes */}
      {/* {allArticleRoutes()} */}
      <AllArticleRoutes />
    </Switch>
  );
}

export default ArticleRoutes;
