import React, { useEffect, useState } from "react";
import { Formik, Field, Form, useFormikContext } from "formik";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { querySearchType } from "../../services";
// import CONSTANTS from "../../utils/Constants";
import GenreExInclusion from "./GenreExInclusion";
import FilterOptions from "./FilterOptions";
import RadioBtn from "./RadioBtn";
import DropDown from "./DropDown";
import Pagination from "../CommonUI/Pagination";
import ErrMsg from "../CommonUI/ErrorMessage";
import "./search.scss";

// const INCLUSION_TYPES = ["NEUTRAL", "INCLUSION", "EXCLUSION"];

// const SearchBar = () => {
// return (<>
// </>);
// };

// const AdvancedFilter = () => {

// }

// const DetailedBooks = ({ resultsList }) => {
//   const mappedItems = resultsList?.map(
//     ({ book_id: bookId, book_title: bookTitle }) => (
//       <article key={`detailed-books-issues-${bookId}`}>
//         Title: {bookTitle}
//       </article>
//     )
//   );
//   return mappedItems || null;
// };

// const DetailedIssues = ({ resultsList }) => {
//   const mappedItems = resultsList?.map(
//     ({ issue_id: IssueId, issue_title: IssueTitle }) => (
//       <article key={`detailed-books-issues-${IssueId}`}>
//         Title: {IssueTitle}
//       </article>
//     )
//   );
//   return mappedItems || null;
// };

const DetailedUsers = ({ resultsList }) => {
  return <article>User Component</article>;
};

const DetailedBooksIssues = ({ isIssue, resultsList }) => {
  const mappedItems = resultsList?.map(
    (
      {
        book_id: bookId,
        issue_id: IssueId,
        cover_photo: coverPhoto,
        book_title: bookTitle,
        issue_title: IssueTitle,
        description,
      },
      index
    ) => (
      <article key={`detailed-books-issues-${IssueId || bookId}`}>
        <h2>
          #{index + 1} Title: {IssueTitle || bookTitle}
        </h2>
        {isIssue ? <h3>{bookTitle}</h3> : null}
        <p>{description}</p>
      </article>
    )
  );
  return mappedItems || null;
};

const ListedResults = ({ type, resultsList }) => {
  // const props = { resultsList };

  if (type === "users") {
    return <DetailedUsers resultsList={resultsList} />;
  }

  // if (type === "books") {
  //   return <DetailedBooks {...props} />;
  // }

  // return <DetailedIssues {...props} />;
  // {...{ type, resultsList }}
  return (
    <DetailedBooksIssues
      isIssue={type === "issues"}
      resultsList={resultsList}
    />
  );
};

const SearchResult = ({
  results,
  error,
  setFieldValue,
  values,
  submitForm,
}) => {
  const setPage = async (page) => {
    setFieldValue("page", page);
    // this will also need to trigger a submit
    await submitForm();
  };

  return error ? (
    <div className="text-center mt-50">
      <ErrMsg
        errorStatus={error}
        messageText="An Error occurred. Please try again later."
      />
    </div>
  ) : (
    <section className="search-section search-results">
      <ListedResults resultsList={results.searchResults} type={results.type} />
      <Pagination
        className="pagination-bar"
        currentPage={values.page}
        totalCount={results.totalResultCount || 0}
        pageSize={20}
        onPageChange={setPage}
      />
    </section>
  );
};

const SearchForm = ({ values }) => {
  const [advancedFilter, setAdvancedFilter] = useState(false);

  const userSearchTypeDisable = values.searchType === "users";
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
      <section className="search-section">
        <div className="search-type-container">
          <FilterOptions
            fieldName="searchType"
            option={[
              { opt: "Issues", value: "issues" },
              { opt: "Books", value: "books" },
              { opt: "Users", value: "users" },
            ]}
            headerText="search type"
            component={RadioBtn}
          />

          <p className="search-section-header">
            Select <strong>genres</strong> to <strong>include/exclude</strong>:{" "}
          </p>
          <section className="genre-container search-section-body">
            <GenreExInclusion disabled={userSearchTypeDisable} />
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
            disabled={userSearchTypeDisable}
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
            disabled={userSearchTypeDisable}
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
  const [initQueryStr, setInitQueryStr] = useState({});
  const [results, setResults] = useState({});
  const [error, setError] = useState(false);
  const history = useHistory();
  const location = useLocation();

  // on init and when the url changes, iterate over the query params and add it to initQueryStr state
  useEffect(() => {
    // access the current query params in the url
    const params = new URLSearchParams(location.search);

    const searchParams = params.entries();

    // add all the query param values from the url to the initQueryStr state object
    [...searchParams].forEach((row) => {
      setInitQueryStr((prevState) => ({ ...prevState, [row[0]]: row[1] }));
    });

    (async () => {
      try {
        const searchType = params.get("search-type") || "issues";
        const existingPageNum = params.get("page");

        // search api request and setResults
        const {
          data: {
            type,
            totalResultCount,
            currentResultCount,
            books,
            issues,
            users,
          },
        } = await querySearchType(searchType, location.search);

        // if there is no page url path, add a page value of 1 to the initial query str
        if (!existingPageNum) {
          setInitQueryStr((prevState) => ({ ...prevState, page: 1 }));
        }

        setResults({
          type,
          totalResultCount,
          currentResultCount,
          searchResults: books || issues || users,
        });
      } catch (err) {
        setError(true);
      }
    })();
  }, [location]);
  // useEffect(() => {
  //   console.log("initQueryStr", initQueryStr);
  // }, [initQueryStr]);

  const onSubmit = (values, { setSubmitting }) => {
    const params = new URLSearchParams(location.search);
    let newQueryString = "";

    // if the selected searchTypes is not users, add the rest of the optional queries
    const optionalQueries =
      values.searchType !== "users"
        ? [
            { genreInclude: "include" },
            { genreExclude: "exclude" },
            { status: "status" },
            { contentRating: "content-rating" },
          ]
        : [{}];

    /* 
      do not add the page query param to the new URL if the selected search type is different than the current one
      (This resets the query search to page 1) AND if the current page number DOES NOT 1 (this prevents the &page=1 
      from appearing in the url).
    */

    const optionalPageQuery =
      values.searchType === params.get("search-type") && values.page !== 1
        ? { page: "page" }
        : {};

    const queryOrderArr = [
      { queryStr: "q" },
      { searchType: "search-type" },
      ...optionalQueries,
      { limit: "limit" },
      optionalPageQuery,
      { sortBy: "sort" },
    ];

    // reset initial state for incoming data
    setInitQueryStr({});

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
          searchType: initQueryStr?.["search-type"] || "issues",
          genreInclude: initQueryStr?.include?.split(",") || [],
          genreExclude: initQueryStr?.exclude?.split(",") || [],
          status: initQueryStr?.status || "",
          contentRating: initQueryStr?.["content-rating"] || "",
          sortBy: initQueryStr?.sort || "",
          limit: initQueryStr?.limit || null,
          page: Number(initQueryStr?.page) || 0,
          validationSchema: Yup.object({}),
        }}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(props) => (
          <>
            <SearchForm {...props} />
            <SearchResult {...props} results={results} error={error} />
          </>
        )}
      </Formik>
    </div>
  );
};

export default Search;
