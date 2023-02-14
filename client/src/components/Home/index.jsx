import React from "react";
import { Link } from "react-router-dom";
import Modal from './../../components/CommonUI/Modal';
import "./home.scss";

const LinkButton = ({ buttonText, link, btnClass }) => (
  <Link to={link} className="link-button">
    <button type="button" className={`bsc-button transparent ${btnClass}`}>
      {buttonText}
    </button>
  </Link>
);

const homePageSections = [
  {
    sectionNum: "one",
    slantDirection: "left",
    headerText: "Welcome to Bluestone Comics",
    detailsText: (
      <>
        <span>
          Bluestone comics is a celebration of american comics books. Our goal
          is to promote their creation and culture.
        </span>
        <LinkButton
          buttonText="Upload Your Work"
          link="/upload"
          btnClass="upload-btn transparent-black"
        />
      </>
    ),
  },
  {
    sectionNum: "two",
    slantDirection: "right",
    headerText: "Awards",
    detailsText:
      "If your work stands out from the rest, your work may be featured on the homepage.",
  },
  {
    sectionNum: "three",
    slantDirection: "left",
    headerText: "Sponsorship",
    detailsText:
      "Popular works may have the chance to receive sponsorship in the future.",
  },
];

const Home = () => {
  return (
    <main className="container-fluid home-page">
      {homePageSections.map(
        ({ sectionNum, slantDirection, headerText, detailsText }) => (
          <section className={`hero-container sect-${sectionNum}`}>
            <div className="hero-image-container" />
            <article className={`desc ${slantDirection}-slant`}>
              <section className="desc-content">
                <h1 className="primary-header">{headerText}</h1>
                <p className="details">{detailsText}</p>
              </section>
            </article>
          </section>
        )
      )}
    </main>
  );
};
export default Home;
