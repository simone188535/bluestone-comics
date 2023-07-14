import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import allPageData from "../article-details";

import Articles from "..";

function ArticleRoutes() {
  const { path } = useRouteMatch();

  const allArticleRoutes = allPageData.map(({ key, link, pageComp }) => (
    <Route path={`/${link}`} key={key}>
      {pageComp}
    </Route>
  ));

  return (
    <Switch>
      <Route exact path={path}>
        <Articles />
      </Route>
      {/* map over all article routes */}
      {allArticleRoutes}
    </Switch>
  );
}

export default ArticleRoutes;
