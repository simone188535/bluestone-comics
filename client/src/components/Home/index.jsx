import React from "react";
import { Link } from "react-router-dom";
import MetaTags from "../MetaTags";
import batmanXLarge from "../../assets/homepage/batman-welcome-XL.jpg";
import batmanLarge from "../../assets/homepage/batman-welcome-Large.jpg";
import batmanMedium from "../../assets/homepage/batman-welcome-Medium.jpg";
import batmanSmall from "../../assets/homepage/batman-welcome-Small.jpg";
import blackPantherXLarge from "../../assets/homepage/black-panther-awards-XL.jpg";
import blackPantherLarge from "../../assets/homepage/black-panther-awards-Large.jpg";
import blackPantherMedium from "../../assets/homepage/black-panther-awards-Medium.jpg";
import blackPantherSmall from "../../assets/homepage/black-panther-awards-Small.jpg";
import spidermanXLarge from "../../assets/homepage/spiderman-sponsorship-XL.jpg";
import spidermanLarge from "../../assets/homepage/spiderman-sponsorship-Large.jpg";
import spidermanMedium from "../../assets/homepage/spiderman-sponsorship-Medium.jpg";
import spidermanSmall from "../../assets/homepage/spiderman-sponsorship-Small.jpg";
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
    sectionOrder: "odd",
    sectionNum: "one",
    slantDirection: "left",
    imgSrc: {
      xl: batmanXLarge,
      large: batmanLarge,
      medium: batmanMedium,
      small: batmanSmall,
    },
    imgAlt: "Welcome to Bluestone Comics",
    headerText: <h1 className="primary-header">Welcome to Bluestone Comics</h1>,
    detailsText: (
      <>
        <span>
          Bluestone Comics is a celebration of american comics books. Our goal
          is to promote their creation and culture.
        </span>
        <LinkButton
          buttonText="Upload Your Work"
          link="/articles/how-to-publish-your-comic-book-online"
          btnClass="upload-btn transparent-black"
        />
      </>
    ),
  },
  {
    sectionOrder: "even",
    sectionNum: "two",
    slantDirection: "right",
    imgSrc: {
      xl: blackPantherXLarge,
      large: blackPantherLarge,
      medium: blackPantherMedium,
      small: blackPantherSmall,
    },
    imgAlt: "Bluestone Comics Awards",
    headerText: <h2 className="primary-header">Awards</h2>,
    detailsText: (
      <>
        If your work stands out from the rest, It may be featured on the
        homepage. It may also be <strong>eligible for funding</strong>.
      </>
    ),
  },
  {
    sectionOrder: "odd",
    sectionNum: "three",
    slantDirection: "left",
    imgSrc: {
      xl: spidermanXLarge,
      large: spidermanLarge,
      medium: spidermanMedium,
      small: spidermanSmall,
    },
    imgAlt: "Bluestone Comics Sponsorship",
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
          ({
            sectionOrder,
            sectionNum,
            slantDirection,
            imgSrc,
            imgAlt,
            headerText,
            detailsText,
          }) => (
            <section
              className={`hero-container sect-${sectionNum} ${sectionOrder}`}
              key={sectionNum}
            >
              <div className="hero-image-container">
                <picture className="hero-picture">
                  <source media="(min-width: 1200px)" srcSet={imgSrc.xl} />
                  <source media="(min-width: 992px)" srcSet={imgSrc.large} />
                  <source media="(min-width: 768px)" srcSet={imgSrc.medium} />
                  <img
                    className="hero-image"
                    src={imgSrc.small}
                    width="auto"
                    height="auto"
                    alt={imgAlt}
                  />
                </picture>
              </div>
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
