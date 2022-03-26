import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBook } from "../../services";
import "./details.scss";

const Details = () => {
  let { urlSlug, bookId, issueId } = useParams();

  useEffect(() => {
    // create call for getBook and set it to state.
  }, []);

  return (
    <div className="container-fluid details-page">
      <article className="details-header">
        <section className="details-img-container">
          <figure>
            {/* Use flex basis of 20%, flex-grow 1 and flex-shrink 1 */}
          </figure>
        </section>
        <section className="detail-description">
          {/* Use flex basis of 70%, flex-grow 1 and flex-shrink 1 */}
        </section>
      </article>
    </div>
  );
};
export default Details;
