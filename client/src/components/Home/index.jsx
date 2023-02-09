import React from "react";
import { Link } from "react-router-dom";
import wolverine from "../../assets/wolverine.jpeg";
// import starlight from "../../assets/starlight.jpeg";
// import supergirl from "../../assets/starlight.jpeg"
import "./home.scss";

const Home = () => {
  return (
    <main className="container-fluid home-page">
      <section className="hero-container sect-one">
        <div className="hero-image-container" />
        {/* <img className="hero-image" src={wolverine} alt="wolverine" />
        </div> */}
        <article className="desc left-slant">
          <section className="desc-content">
            <h1 className="primary-header">Welcome to Bluestone Comics</h1>
            <p className="details">
              Bluestone comics is a celebration of american comics books. Our
              goal is to promote their creation and culture.
            </p>
            <Link to="/upload" className="link-button">
              <button
                type="button"
                className="bsc-button transparent transparent-black "
              >
                Upload Your Work
              </button>
            </Link>
          </section>
        </article>
      </section>
      <section className="hero-container sect-two">
        <div className="hero-image-container" />
        {/* <img className="hero-image" src={wolverine} alt="wolverine" />
        </div> */}
        <article className="desc right-slant">
          <section className="desc-content">
            <h1 className="primary-header">Awards</h1>
            <p className="details">
              If your work stands out from the rest, your work may be featured
              on the homepage.
            </p>
          </section>
        </article>
      </section>
      <section className="hero-container sect-three">
        <div className="hero-image-container" />
        {/* <img className="hero-image" src={wolverine} alt="wolverine" />
        </div> */}
        <article className="desc left-slant">
          <section className="desc-content">
            <h1 className="primary-header">Sponsorship</h1>
            <p className="details">
              Popular works may have the chance to receive sponsorship in the
              future.
            </p>
          </section>
        </article>
      </section>
    </main>
  );
};
export default Home;
