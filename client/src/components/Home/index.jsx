import React from "react";
import "./home.scss";

const Home = () => {
  return (
    <main className="container-fluid home-page min-vh100">
      <section className="one-third-display sect-one">
        <section className="panel">
          <h1>Bluestone Comics...</h1>{" "}
          <h2>
            is a celebration of american comics books. Our goal is to promote
            their creation and culture.
          </h2>
        </section>
        <section className="panel" />
      </section>
      <section className="one-third-display sect-two">
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
      </section>
    </main>
  );
};
export default Home;
