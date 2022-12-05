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

// create initial genre dynamic state
const genreObj = {};
CONSTANTS.GENRES.forEach((genre) => {
  genreObj[genre] = {
    selectedIndex: 0,
  };
});

const GenreExInclusion = () => {
  // const [selectedIndex, setSelectedIndex] = useState(0);
  const [genres, setGenres] = useState(genreObj);
  const { values, setValues } = useFormikContext();

  const classOptions = { include: "include", exclude: "exclude" };

  // useEffect(() => {
  //   console.log("genres", genres);
  // }, [genres]);

  useEffect(() => {
    console.log("values", values);
  }, [values]);

  useEffect(() => {
    // if selectedIndex is 0 (neutral), remove the current value from the genreExclude arr
    // if (selectedIndex === 0) {
    //   console.log("?");
    //   setValues({
    //     genreExclude: values.genreExclude.filter((value) => value !== genre),
    //   });
    // }
    //   // if selectedIndex is 1 (include), add current value to the genreInclude arr
    //   else if (selectedIndex === 1) {
    //     setValues({ genreInclude: [...values.genreInclude, genre] });
    //   }
    //   // if selectedIndex is 2 (exclude), remove the current value from the genreInclude arr and add it to the genreExclude arr
    //   else if (selectedIndex === 2) {
    //     setValues({
    //       genreInclude: values.genreInclude.filter((value) => value !== genre),
    //       genreExclude: [...values.genreExclude, genre],
    //     });
    //   }
  }, []);

  // const updateFormikState = (selectedIndex, genre) => {
  //   // if selectedIndex is 0 (neutral), remove the current value from the genreExclude arr
  //   if (selectedIndex === 0) {
  //     console.log("?");
  //     setValues({
  //       genreExclude: values.genreExclude.filter((value) => value !== genre),
  //     });
  //   }
  //   // if selectedIndex is 1 (include), add current value to the genreInclude arr
  //   else if (selectedIndex === 1) {
  //     setValues({ genreInclude: [...values.genreInclude, genre] });
  //   }
  //   // if selectedIndex is 2 (exclude), remove the current value from the genreInclude arr and add it to the genreExclude arr
  //   else if (selectedIndex === 2) {
  //     setValues({
  //       genreInclude: values.genreInclude.filter((value) => value !== genre),
  //       genreExclude: [...values.genreExclude, genre],
  //     });
  //   }
  // };

  // create a three way toggle for all the genre buttons
  // increments the index and restart from 0 if the selected index is 2
  const exInclusionToggle = (key) => {
    const currGenreSelectedIndex = genres[key]?.selectedIndex;

    if (!currGenreSelectedIndex && typeof currGenreSelectedIndex !== "number")
      return null;

    const setGenreHelper = (newSelectedIndex) =>
      setGenres((prevState) => ({
        ...prevState,
        [key]: {
          ...prevState[genres[key]],
          selectedIndex: newSelectedIndex,
        },
      }));

    return currGenreSelectedIndex === 2
      ? setGenreHelper(0)
      : setGenreHelper(currGenreSelectedIndex + 1);
  };

  //   const type = INCLUSION_TYPES[selectedIndex];

  //   useEffect(() => {
  //     console.log(genre, INCLUSION_TYPES[selectedIndex], selectedIndex);
  //   }, [genre, selectedIndex]);
  const inExcludeClassIcons = ({ include, exclude }, genre) => {
    const genreSelectedIndex = genres[genre]?.selectedIndex;
    if (genreSelectedIndex === 1) {
      return include;
    }
    if (genreSelectedIndex === 2) {
      return exclude;
    }

    return "";
  };

  const allGenres = Object.keys(genres).map((genre) => (
    <div className="genre-holder" key={`genre-inclusion-${genre}`}>
      <button
        type="button"
        className={`genre-button ${inExcludeClassIcons(classOptions, genre)}`}
        onClick={() => exInclusionToggle(genre)}
      >
        {genre}
      </button>
    </div>
  ));

  return allGenres;
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

  const searchTypeRadioBtn = ["books", "issues", "users"].map((type) => (
    <label key={`radio-btn-type-${type}`} className="radio-btn-label">
      <Field
        type="radio"
        name="searchType"
        value={type}
        className="radio-btn"
      />
      {type}
    </label>
  ));

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
          <p className="filter-section-header">
            Select a <strong>search type</strong>:{" "}
          </p>
          <div className="search-type">{searchTypeRadioBtn}</div>
          <p className="filter-section-header">
            Select <strong>genre inclusion/exclusion</strong>:{" "}
          </p>
          <section className="genre-container">
            <GenreExInclusion />
          </section>
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
          genreInclude: initQueryStr?.include || [],
          genreExclude: initQueryStr?.exclude || [],
          status: initQueryStr?.status || null,
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
