import React, { useEffect, useState } from "react";
import moment from "moment";
import { Formik, Field, Form } from "formik";
import { Link, useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { querySearchType } from "../../services";
import CONSTANTS from "../../utils/Constants";
import { scrollToTop } from "../../utils/scrollToTop";
import GenreExInclusion from "./GenreExInclusion";
import FilterOptions from "./FilterOptions";
import RadioBtn from "./RadioBtn";
import DropDown from "./DropDown";
import Pagination from "../CommonUI/Pagination";
import ErrMsg from "../CommonUI/ErrorMessage";
import Checkboxes from "../CommonUI/Checkboxes";
import ReadMore from "../CommonUI/ReadMore";
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
const { NUM_OF_ITEMS_PER_SEARCH_PAGE } = CONSTANTS;

const DetailedUsers = ({ resultsList }) => {
  return <article>User Component</article>;
};

const DetailedBooksIssues = ({ isIssue, resultsList }) => {
  const mappedItems = resultsList?.map(
    ({
      book_id: bookId,
      issue_id: IssueId,
      cover_photo: coverPhoto,
      book_title: bookTitle,
      issue_title: IssueTitle,
      description,
      url_slug: urlSlug,
      issue_number: issueNumber,
      total_issues: totalIssues,
      total_issue_pages: totalIssuePages,
      total_book_pages: totalBookPages,
      content_rating: contentRating,
      username,
      status,
      date_created: dateCreated,
    }) => {
      const conditionalExtraDetails = isIssue
        ? [
            { key: "Issue #", val: issueNumber },
            { key: "Total Issue Pages", val: totalIssuePages },
          ]
        : [{ key: "Total Book Pages", val: totalBookPages }];

      const extraDetails = [
        {
          key: "Status",
          val: status,
        },
        ...conditionalExtraDetails,
        {
          key: "Total Issues",
          val: totalIssues,
        },
        {
          key: "Content Rating",
          val: contentRating,
        },
      ].map(({ key, val }) => (
        <span className="extra-details" key={`extra-details-${key}`}>
          {`${key}: ${val} `}
        </span>
      ));

      return (
        <article
          className="search-result"
          key={`detailed-books-issues-${IssueId || bookId}`}
        >
          <section className="work-thumbnail">
            <Link to={`/details/${urlSlug}/book/${bookId}`}>
              <img
                className="work-thumbnail-img"
                src={coverPhoto}
                alt={`${IssueTitle || bookTitle}-thumbnail`}
              />
            </Link>
          </section>
          <section className="work-details">
            <div className="title-row">
              <h2 className="title">
                <Link
                  className="title-link"
                  to={`/read/${urlSlug}/book/${bookId}/issue/${
                    issueNumber || totalIssues
                  }`}
                >
                  {IssueTitle || bookTitle}
                </Link>
                {` `}
                by
                {` `}
                <Link className="title-link" to={`/profile/${username}`}>
                  {username}
                </Link>
              </h2>
              <p className="date-created">
                <span className="date">
                  {moment(dateCreated).format("MMM D, YYYY")}
                </span>
              </p>
            </div>
            {isIssue ? (
              <h3 className="sub-title">
                <Link
                  className="sub-title-link"
                  to={`/details/${urlSlug}/book/${bookId}`}
                >
                  {bookTitle}
                </Link>
              </h3>
            ) : null}
            <p className="work-desc">
              <ReadMore content={description} maxStringLengthShown={500} />
            </p>
            <p className="extra-details-container">{extraDetails}</p>
          </section>
        </article>
      );
    }
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
  advFilterIsOpen,
  setAdvFilter,
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

  // calculate the number of items per page and their index
  const calcNumItemsPerPage = () => {
    const start = (values.page - 1) * NUM_OF_ITEMS_PER_SEARCH_PAGE + 1;
    const end = Math.min(
      start + NUM_OF_ITEMS_PER_SEARCH_PAGE - 1,
      results.totalResultCount
    );
    return `${start}-${end}`;
  };

  const activeClass = advFilterIsOpen ? "active" : "";

  return error ? (
    <div className="text-center mt-50">
      <ErrMsg
        errorStatus={error}
        messageText="An Error occurred. Please try again later."
      />
    </div>
  ) : (
    <section className="search-section search-results">
      <section className="search-details">
        <div className="result-count">
          <div>
            <span className="count-num">{calcNumItemsPerPage()}</span> of{" "}
            <span className="count-num">{results.totalResultCount}</span> Total
            Results
          </div>
        </div>
        <div className="result-format">
          <button
            type="button"
            className={`filter-btn bsc-button transparent transparent-blue not-round ${activeClass}`}
            onClick={setAdvFilter}
          >
            Advanced Filter
          </button>
        </div>
      </section>
      <ListedResults resultsList={results.searchResults} type={results.type} />
      {results.totalResultCount && (
        <Pagination
          className="pagination-bar"
          currentPage={values.page}
          totalCount={results.totalResultCount}
          pageSize={NUM_OF_ITEMS_PER_SEARCH_PAGE}
          onPageChange={setPage}
        />
      )}
    </section>
  );
};

const SearchForm = ({ values, setAdvFilter, advFilterIsOpen }) => {
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
      {advFilterIsOpen && (
        <section className="search-section">
          <button
            type="button"
            onClick={setAdvFilter}
            className="bsc-button close-btn search-filter-close"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
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
              Select <strong>genres</strong> to <strong>include/exclude</strong>
              :{" "}
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

            {/* <FilterOptions
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
            /> */}
            <p className="search-section-header">
              Select a <strong>content rating</strong>:{" "}
            </p>
            <div className="search-section-body">
              <Checkboxes
                identifier="contentRating"
                type="multiple"
                className="form-btn-label"
                checkboxValue={[
                  {
                    name: "General",
                    value: "G",
                    disabled: userSearchTypeDisable,
                  },
                  { name: "Teen", value: "T", disabled: userSearchTypeDisable },
                  {
                    name: "Mature",
                    value: "M",
                    disabled: userSearchTypeDisable,
                  },
                  {
                    name: "Explicit",
                    value: "E",
                    disabled: userSearchTypeDisable,
                  },
                ]}
              />
            </div>

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
          <button
            type="submit"
            className="search-filter-btn bsc-button transparent transparent-blue not-round"
          >
            Search
          </button>
        </section>
      )}
    </Form>
  );
};

const Search = () => {
  const [initQueryStr, setInitQueryStr] = useState({});
  const [advFilterIsOpen, setAdvFilterIsOpen] = useState(false);
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
  const setAdvFilter = () => setAdvFilterIsOpen(!advFilterIsOpen);

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

    const queryOrderArr = [
      { queryStr: "q" },
      { searchType: "search-type" },
      ...optionalQueries,
      { limit: "limit" },
      { sortBy: "sort" },
    ];

    /*
      if any of the values in formik state are different than the values in the url path,
      the page object should not be added to the query string
    */
    const formikValsHaveChanged = queryOrderArr.some((obj) => {
      const objKey = Object.keys(obj);
      const indexedFormikVal = values[objKey];
      const urlVal = params.get(Object.values(obj)) || null;
      /*
         on initial search, when the searchType url path is null, The searchType object will always be different from the index url path because
         it will have a default value of "issues", this condition prevents formikValsHaveChanged from returning true
         in that use case
      */
      if (objKey[0] === "searchType" && !urlVal) return false;

      /* 
        if value is an array, turn it in to a string separated by commas (because that is the format for arrays 
        in the url) else simply return the formik val
      */
      const formikValFormatted = Array.isArray(indexedFormikVal)
        ? indexedFormikVal.join(",")
        : indexedFormikVal;

      const formikVal = formikValFormatted || null;
      return formikVal !== urlVal;
    });

    /* 
      do not add the page query param to the new URL if the selected formik values have changed
      (Not adding it will this resets the query search to page 1) AND if the current page number 
      DOES NOT equal 1 (this prevents the &page=1 from appearing in the url).
    */
    if (!formikValsHaveChanged && values.page !== 1) {
      queryOrderArr.push({ page: "page" });
    }

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
    // start page at the beginning of the search results
    scrollToTop();
    // close search adv filter if it is open
    if (advFilterIsOpen) {
      setAdvFilter();
    }
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
          contentRating: initQueryStr?.["content-rating"]?.split(",") || [],
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
            <SearchForm
              {...props}
              setAdvFilter={setAdvFilter}
              advFilterIsOpen={advFilterIsOpen}
            />
            <SearchResult
              {...props}
              results={results}
              error={error}
              setAdvFilter={setAdvFilter}
              advFilterIsOpen={advFilterIsOpen}
            />
          </>
        )}
      </Formik>
    </div>
  );
};

export default Search;
