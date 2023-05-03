import React from "react";
import MetaTags from "../MetaTags";
import "./about.scss";

const About = () => {
  return (
    <>
      <MetaTags
        title="Bluestone Comics | About"
        canonical="https://www.bluestonecomics.com/about"
        description="Bluestone Comics' mission statement and goals for the future. Our Passion is supporting the creation of indie comics."
      />
      <div className="container about-page min-vh100">
        <h1 className="hidden-header">
          About Us Page - Mission Statement and Goals
        </h1>
        <h2 className="header">About Us</h2>
        <p className="desc">
          Bluestone comics is a celebration of american comics books. Our goal
          is to promote their creation and culture by allowing our users to
          upload their own work.
        </p>
        <p className="desc">
          In the future, our hope is to sponsor and reward comics that stand out
          from the competition.
        </p>
      </div>
    </>
  );
};
export default About;
