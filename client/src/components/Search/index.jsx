import React, { useEffect, useState } from "react";
import { Formik, Field, Form, useFormikContext } from "formik";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
// import { searchBooks, searchIssues, searchUser } from "../../../../services";
// import CONSTANTS from "../../utils/Constants";
import GenreExInclusion from "./GenreExInclusion";
import FilterOptions from "./FilterOptions";
import RadioBtn from "./RadioBtn";
import DropDown from "./DropDown";
import "./search.scss";

// const INCLUSION_TYPES = ["NEUTRAL", "INCLUSION", "EXCLUSION"];

// const SearchBar = () => {
// return (<>
// </>);
// };

// const AdvancedFilter = () => {

// }

const SearchResult = ({ results }) => {};

const SearchForm = () => {
  const [advancedFilter, setAdvancedFilter] = useState(false);
  // const { values } = useFormikContext();

  //   const baseURLHelper = () => {
  //     const { searchType } = values;
  //     let baseURL = "";
  //     if (searchType === "books") {
  //       baseURL = searchBooks;
  //     } else if (searchType === "issues") {
  //       baseURL = searchIssues;
  //     } else if (searchType === "users") {
  //       baseURL = searchUser;
  //     }

  //     return baseURL(values);
  //   };

  //   useEffect(() => {
  //     console.log(initQueryStr);
  //   }, [initQueryStr]);

  //   useEffect(() => {
  //     console.log("values", values);
  //   }, [values]);

  return (
    <Form className="search-filter-form">
      <section className="search-bar-container">
        <Field
          type="text"
          name="queryStr"
          className="search-bar"
          placeholder="Search..."
        />
        <button type="submit" className="search-button-btn">
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
      </section>
      <button
        type="button"
        className="filter-btn bsc-button transparent transparent-blue"
        onClick={() => setAdvancedFilter(!advancedFilter)}
      >
        Filter
      </button>
      <section className="filter-section">
        <div className="search-type-container">
          <FilterOptions
            fieldName="searchType"
            option={[
              { opt: "Books", value: "books" },
              { opt: "Issues", value: "issues" },
              { opt: "Users", value: "users" },
            ]}
            headerText="search type"
            component={RadioBtn}
          />

          <p className="filter-section-header">
            Select <strong>genre inclusion/exclusion</strong>:{" "}
          </p>
          <section className="genre-container filter-section-body">
            <GenreExInclusion />
          </section>

          <FilterOptions
            fieldName="status"
            option={[
              { opt: "All", value: "" },
              { opt: "Ongoing", value: "ongoing" },
              { opt: "Completed", value: "completed" },
              { opt: "Hiatus", value: "hiatus" },
            ]}
            headerText="status"
            component={RadioBtn}
          />

          <FilterOptions
            fieldName="contentRating"
            option={[
              { opt: "All", value: "" },
              { opt: "General", value: "G" },
              { opt: "Teen", value: "T" },
              { opt: "Mature", value: "M" },
              { opt: "Explicit", value: "E" },
            ]}
            headerText="content rating"
            component={RadioBtn}
          />

          <FilterOptions
            fieldName="sortBy"
            option={[
              { opt: "Select Sort", value: "" },
              { opt: "Newest to Oldest", value: "ASC" },
              { opt: "Oldest to Newest", value: "DESC" },
            ]}
            headerText="date range"
            isDropdown
            component={DropDown}
          />
        </div>
      </section>
    </Form>
  );
};

const Search = () => {
  const location = useLocation();
  const history = useHistory();
  const [initQueryStr, setInitQueryStr] = useState({});
  const [results, setResults] = useState([]);

  // on init and when the url changes, iterate over the query params and add it to initQueryStr state
  useEffect(() => {
    // access the current query params in the url
    const params = new URLSearchParams(window.location.search);

    const searchParams = params.entries();

    // add all the query param values from the url to the initQueryStr state object
    [...searchParams].forEach((row) => {
      setInitQueryStr((prevState) => ({ ...prevState, [row[0]]: row[1] }));
    });

    // search api request and setResults
    console.log("refresh?");
  }, [location]);

  const onSubmit = (values, { setSubmitting }) => {
    let newQueryString = "";

    const queryOrderArr = [
      { queryStr: "q" },
      { searchType: "search-type" },
      { genreInclude: "include" },
      { genreExclude: "exclude" },
      { status: "status" },
      { contentRating: "content-rating" },
      { sortBy: "sort" },
    ];

    // create a dynamic string based off the key value pair
    queryOrderArr.forEach((obj) => {
      /*
       if the current object key has a value in formik, append the 
        object value and the formik value to the new query string
      */
      const formikObjStateVal = values[Object.keys(obj)];
      /* if the current obj val is an array, check that the length of the array is
      greater than 0, else just check if the string has value
      */
      const hasValue = Array.isArray(formikObjStateVal)
        ? formikObjStateVal.length > 0
        : formikObjStateVal;

      // add and ampersand for all key val pairs except the first
      const addAmpersand = newQueryString ? "&" : "";

      if (hasValue)
        newQueryString += `${addAmpersand}${Object.values(
          obj
        )}=${formikObjStateVal}`;
    });

    // update url
    history.push(`/search?${newQueryString}`);
    setSubmitting(false);
  };

  return (
    <div className="container-fluid search-page min-vh100">
      <Formik
        initialValues={{
          queryStr: initQueryStr?.q || "",
          searchType: initQueryStr?.["search-type"] || "books",
          genreInclude: initQueryStr?.include?.split(",") || [],
          genreExclude: initQueryStr?.exclude?.split(",") || [],
          status: initQueryStr?.status || "",
          contentRating: initQueryStr?.["content-rating"] || "",
          sortBy: initQueryStr?.sort || "",
          validationSchema: Yup.object({}),
        }}
        onSubmit={onSubmit}
        enableReinitialize
        component={SearchForm}
      />
      {/* <SearchResult results={[]} /> */}
    </div>
  );
};

export default Search;
