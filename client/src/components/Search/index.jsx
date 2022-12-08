import React, { useEffect, useState } from "react";
import {
  Formik,
  Field,
  Form,
  useFormikContext,
  // , ErrorMessage
} from "formik";
// import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
// import { searchBooks, searchIssues, searchUser } from "../../../../services";
import CONSTANTS from "../../utils/Constants";
import "./search.scss";

// const INCLUSION_TYPES = ["NEUTRAL", "INCLUSION", "EXCLUSION"];

// const SearchBar = () => {
// return (<>
// </>);
// };

// const AdvancedFilter = () => {

// }

const GenreExInclusion = () => {
  const { values, setFieldValue } = useFormikContext();
  const classOptions = { include: "include", exclude: "exclude" };

  // create a three way toggle for all the genre buttons
  // increments the index and restart from 0 if the selected index is 2
  const exInclusionToggle = (genre) => {
    const genreIncluded = values.genreInclude.includes(genre);
    const genreExcluded = values.genreExclude.includes(genre);

    // if NOT genreIncluded and NOT genreExcluded (neutral), add current value to the genreInclude arr
    if (!genreIncluded && !genreExcluded) {
      setFieldValue("genreInclude", [...values.genreInclude, genre]);
    }
    // if the genre is already in (include), remove the current value from the genreInclude arr and add it to the genreExclude arr
    else if (genreIncluded) {
      setFieldValue(
        "genreInclude",
        values.genreInclude.filter((value) => value !== genre)
      );
      setFieldValue("genreExclude", [...values.genreExclude, genre]);
    }
    // if the genre is already in genreExcluded (exclude), remove the current value from the genreExclude arr
    else if (genreExcluded) {
      setFieldValue(
        "genreExclude",
        values.genreExclude.filter((value) => value !== genre)
      );
    }
  };

  const inExcludeClassIcons = ({ include, exclude }, genre) => {
    if (values?.genreInclude?.includes(genre)) {
      return include;
    }
    if (values?.genreExclude?.includes(genre)) {
      return exclude;
    }

    return "";
  };

  const allGenres = CONSTANTS.GENRES.map((genre) => (
    <div className="genre-holder" key={`genre-inclusion-${genre}`}>
      <button
        type="button"
        className={`genre-button ${inExcludeClassIcons(
          classOptions,
          genre.toLowerCase()
        )}`}
        onClick={() => exInclusionToggle(genre.toLowerCase())}
      >
        {genre}
      </button>
    </div>
  ));

  return allGenres;
};

const RadioFilter = ({
  fieldName,
  option,
  headerText,
  fieldProps = {},
  labelProps = {},
}) => {
  const searchTypeRadioBtn = option.map(({ opt, value }) => (
    <label
      key={`filter-btn-type-${opt}`}
      className="radio-btn-label"
      {...labelProps}
    >
      <Field
        // type="radio"
        name={fieldName}
        value={value}
        // className="radio-btn"
        {...fieldProps}
      />
      {opt}
    </label>
  ));

  return (
    <>
      <p className="filter-section-header">
        Select a <strong>{headerText}</strong>:
      </p>
      <div className="search-type-radio filter-section-body">
        {searchTypeRadioBtn}
      </div>
    </>
  );
};

const SearchForm = () => {
  const [advancedFilter, setAdvancedFilter] = useState(false);
  //   const { values } = useFormikContext();

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
          <RadioFilter
            fieldName="searchType"
            option={[
              { opt: "Books", value: "books" },
              { opt: "Issues", value: "issues" },
              { opt: "Users", value: "users" },
            ]}
            headerText="search type"
            fieldProps={{ type: "radio", className: "radio-btn" }}
          />

          <p className="filter-section-header">
            Select <strong>genre inclusion/exclusion</strong>:{" "}
          </p>
          <section className="genre-container filter-section-body">
            <GenreExInclusion />
          </section>

          <RadioFilter
            fieldName="status"
            option={[
              { opt: "All", value: "" },
              { opt: "Ongoing", value: "ongoing" },
              { opt: "Completed", value: "completed" },
              { opt: "Hiatus", value: "hiatus" },
            ]}
            headerText="status"
            fieldProps={{ type: "radio", className: "radio-btn" }}
          />

          <RadioFilter
            fieldName="contentRating"
            option={[
              { opt: "All", value: "" },
              { opt: "General", value: "G" },
              { opt: "Teen", value: "T" },
              { opt: "Mature", value: "M" },
              { opt: "Explicit", value: "E" },
            ]}
            headerText="content rating"
            fieldProps={{ type: "radio", className: "radio-btn" }}
          />

          <RadioFilter
            fieldName="sortBy"
            option={[
              { opt: "Select Sort", value: "" },
              { opt: "Newest to Oldest", value: "ASC" },
              { opt: "Oldest to Newest", value: "DESC" },
            ]}
            headerText="date range"
            fieldProps={{ as: "select" }}
          />
        </div>
      </section>
    </Form>
  );
};

const Search = () => {
  const [initQueryStr, setInitQueryStr] = useState({});

  useEffect(() => {
    // access the current query params in the url
    const params = new URLSearchParams(window.location.search);

    const searchParams = params.entries();

    // add all the query param values from the url to the initQueryStr state object
    [...searchParams].forEach((row) => {
      setInitQueryStr((prevState) => ({ ...prevState, [row[0]]: row[1] }));
    });
  }, []);

  return (
    <div className="container-fluid search-page min-vh100">
      <Formik
        initialValues={{
          queryStr: initQueryStr?.q || "",
          searchType: initQueryStr?.type || "books",
          genreInclude: initQueryStr?.include?.split(",") || [],
          genreExclude: initQueryStr?.exclude?.split(",") || [],
          status: initQueryStr?.status || "",
          contentRating: initQueryStr?.rating || "",
          sortBy: initQueryStr?.sort || null,
          validationSchema: Yup.object({}),
        }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
        enableReinitialize
        component={SearchForm}
      />
    </div>
  );
};

export default Search;
