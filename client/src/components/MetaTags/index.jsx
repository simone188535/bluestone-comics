import React from "react";
import { Helmet } from "react-helmet-async";

const MetaTags = ({ title, canonical, description, children = null }) => {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {canonical && <link rel="canonical" href={canonical} />}
      {description && <meta name="description" content={description} />}
      {/* TODO: add social media tags later */}
      {children}
    </Helmet>
  );
};
export default MetaTags;
