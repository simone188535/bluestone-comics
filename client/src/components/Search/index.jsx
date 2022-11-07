import React, { useEffect, useState } from "react";
import {
  Formik,
  Field,
  Form,
  // , ErrorMessage
} from "formik";
// import { useParams } from "react-router-dom";
import * as Yup from "yup";

// const SearchBar = () => {
// return (<>
// </>);
// };

// const AdvancedFilter = () => {

// }
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

  //   useEffect(() => {
  //     console.log(initQueryStr);
  //   }, [initQueryStr]);

  return (
    <>
      <h1>Search</h1>
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
        <Form>
          <Field type="text" name="queryStr" className="search-bar" />
          {/* <SearchBar /> */}
        </Form>
      </Formik>
    </>
  );
};

export default Search;
