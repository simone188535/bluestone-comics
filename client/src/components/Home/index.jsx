import React from "react";
import { Link } from "react-router-dom";
import MetaTags from "../MetaTags";
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
    headerText: <h1 className="primary-header">Welcome to Bluestone Comics</h1>,
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
    headerText: <h2 className="primary-header">Awards</h2>,
    detailsText: (
      <>
        If your work stands out from the rest, It may be featured on the
        homepage. It may also be <strong>eligible for funding</strong>.
      </>
    ),
  },
  {
    sectionNum: "three",
    slantDirection: "left",
    headerText: <h2 className="primary-header">Sponsorship</h2>,
    detailsText:
      "Popular comics may have the chance to receive sponsorship in the future.",
  },
];

const Home = () => {
  return (
    <>
      <MetaTags
        title="Bluestone Comics: Make and Read American WebComics"
        canonical="https://www.bluestonecomics.com"
        description="Bluestone Comics is a celebration of American comic books. Upload your own American style comic books. Read all comic books for free. Bring your comics to life."
      />
      <main className="container-fluid home-page">
        {homePageSections.map(
          ({ sectionNum, slantDirection, headerText, detailsText }) => (
            <section
              className={`hero-container sect-${sectionNum}`}
              key={sectionNum}
            >
              <div className="hero-image-container"></div>
              <article className={`desc ${slantDirection}-slant`}>
                <section className="desc-content">
                  {headerText}
                  <p className="details">{detailsText}</p>
                </section>
              </article>
            </section>
          )
        )}
      </main>
    </>
  );
};
export default Home;
