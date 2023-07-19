import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import RouteWithSubRoutes from "../../Routes/RouteWithSubRoutes";
import Articles from "..";
import ArticlePage from "../ArticlePage";

import allPageData from "../article-details";

function AllArticleRoutes() {
  return allPageData.map(
    ({
      key,
      link,
      mainComponent: MainComponent,
      asideComponent: AsideComponent,
    }) => {
      const articlePageWContent = () => (
        <ArticlePage
          main={<MainComponent />}
          aside={AsideComponent ? <AsideComponent /> : null}
        />
      );

      return (
        <RouteWithSubRoutes
          key={key}
          path={link}
          component={articlePageWContent}
          routes={{ path: link, component: articlePageWContent }}
        />
      );
    }
  );
}

function ArticleRoutes() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Articles />
      </Route>
      <AllArticleRoutes />
    </Switch>
  );
}

export default ArticleRoutes;
