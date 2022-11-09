import React, { useEffect, useState } from "react";
import {
  Formik,
  Field,
  Form,
  // , ErrorMessage
} from "formik";
// import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./search.scss";

// const SearchBar = () => {
// return (<>
// </>);
// };

// const AdvancedFilter = () => {

// }
const Search = () => {
  const [initQueryStr, setInitQueryStr] = useState({});
  const [advancedFilter, setAdvancedFilter] = useState(false);

  useEffect(() => {
    // access the current query params in the url
    const params = new URLSearchParams(window.location.search);

    const searchParams = params.entries();

    // add all the query param values from the url to the initQueryStr state object
    [...searchParams].forEach((row) => {
      setInitQueryStr((prevState) => ({ ...prevState, [row[0]]: row[1] }));
    });
  }, []);

  //   useEffect(() => {
  //     console.log(initQueryStr);
  //   }, [initQueryStr]);

  return (
    <div className="container-fluid search-page">
      {/* <h1>Search</h1> */}
      <Formik
        initialValues={{
          queryStr: initQueryStr?.q || "",
          validationSchema: Yup.object({}),
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
        enableReinitialize
      >
        <Form className="search-filter-form">
          <section className="search-features">
            <div className="search-bar-container">
              <Field
                type="text"
                name="queryStr"
                className="search-bar"
                placeholder="Search..."
              />
              <button type="button" className="search-button-btn">
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </button>
            </div>
            <div className="btn-option-container">
              <button
                type="button"
                className="filter-btn bsc-button transparent transparent-blue"
                onClick={() => setAdvancedFilter(!advancedFilter)}
              >
                Filter
              </button>
            </div>
          </section>
          {/* <SearchBar /> */}
        </Form>
      </Formik>
    </div>
  );
};

export default Search;
