import React from "react";
import { Link } from "react-router-dom";
import wolverine from "../../assets/wolverine.jpeg";
// import starlight from "../../assets/starlight.jpeg";
// import supergirl from "../../assets/starlight.jpeg"
import "./home.scss";

const Home = () => {
  return (
    <main className="container-fluid home-page min-vh100">
      <section className="hero-container sect-one">
        <div className="hero-image-container">
          <img className="hero-image" src={wolverine} alt="wolverine" />
        </div>
        <article className="desc">
          <h1 className="primary-header">Welcome to Bluestone Comics</h1>
          <p className="details">
            Bluestone comics is a celebration of american comics books. Our goal
            is to promote their creation and culture.
          </p>
          <Link to="/upload" className="link-button">
            <button
              type="button"
              className="bsc-button transparent transparent-black "
            >
              Upload Your Work
            </button>
          </Link>
        </article>
      </section>
      {/* <section className="one-third-display sect-two">
        <section className="panel" />
        <section className="panel">
          <h1>Bluestone Comics...</h1>{" "}
          <h2>
            is a celebration of american comics books. Our goal is to promote
            their creation and culture.
          </h2>
        </section>
      </section>
      <section className="one-third-display sect-three">
        <section className="panel">
          <h1>Bluestone Comics...</h1>{" "}
          <h2>
            is a celebration of american comics books. Our goal is to promote
            their creation and culture.
          </h2>
        </section>
        <section className="panel" />
      </section> */}
    </main>
  );
};
export default Home;
