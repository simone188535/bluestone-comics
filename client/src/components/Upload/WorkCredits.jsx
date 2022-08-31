import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useFormikContext, FieldArray, Field, ErrorMessage } from "formik";
import { searchUser } from "../../services";
import Checkboxes from "../CommonUI/Checkboxes";
import "./workCredits.scss";

// THESE COMPONENTS WORKS WITH FORMIK.

const RenderSearchList = ({ push, apiResults, clearTextInput }) => {
  // Map though APIResults state and iteratively display list items if they exist OR return nothing

  if (apiResults.length > 0) {
    return (
      <ul className="work-credit-search-list">
        {apiResults.slice(0, 10).map((item) => (
          <SearchedUsers
            key={item.id}
            searchedListItem={item}
            push={push}
            clearTextInput={clearTextInput}
          />
        ))}
      </ul>
    );
  }
  return null;
};

const SearchedUsers = ({ searchedListItem, push, clearTextInput }) => {
  const { values } = useFormikContext();
  const addSelectedUser = (selListItem, pushMethod) => {
    // if the Selected User was not already selected, push it to the formik workCredits value
    if (
      !values.workCredits.some(
        ({ username }) => username === selListItem.username
      )
    ) {
      // When a list item is selected, push it to formik workCredits array value
      pushMethod({
        user: selListItem.id,
        username: selListItem.username,
        credits: [],
      });
      // clear out text search
      clearTextInput();
    } else {
      clearTextInput();
    }
  };

  return (
    <li className="work-credit-search-list-item">
      <button
        className="work-credit-search-list-item-btn"
        type="button"
        onClick={() => addSelectedUser(searchedListItem, push)}
      >
        {searchedListItem.username}
      </button>
    </li>
  );
};

const WorkCreditsFields = ({ identifier, apiResults, clearTextInput }) => {
  const { values } = useFormikContext();

  const removeSelectedUser = (remove, index) => {
    // When the remove button is selected (using the index), remove it from formik
    remove(index);
  };

  return (
    <>
      <FieldArray name={identifier}>
        {({ push, remove }) => (
          <div>
            <>
              <RenderSearchList
                apiResults={apiResults}
                push={push}
                clearTextInput={clearTextInput}
              />
            </>
            {values.workCredits.map((credit, index) => {
              // console.log('credit', credit);
              return (
                <div
                  key={credit.user}
                  className="work-credit-selected-search-list-item"
                >
                  <div className="username">{credit.username}</div>

                  {/* This input contains the users ID */}
                  <Field
                    className="user-input"
                    name={`workCredits[${index}].user`}
                    value={credit.user}
                  />
                  <ErrorMessage
                    className="error-message error-text-color wc-error"
                    component="div"
                    name={`workCredits[${index}].user`}
                  />
                  <div className="info-head">
                    While creating this work, this user fulfilled the role(s)
                    of:
                    {` `}
                  </div>
                  <ul className="work-credits-checkbox-section">
                    <Checkboxes
                      identifier={`workCredits[${index}].credits`}
                      type="multiple"
                      wrapperElement="li"
                      checkboxValue={[
                        { name: "Writer", value: "Writer" },
                        { name: "Artist", value: "Artist" },
                        { name: "Editor", value: "Editor" },
                        { name: "Inker", value: "Inker" },
                        { name: "Letterer", value: "Letterer" },
                        { name: "Penciller", value: "Penciller" },
                        { name: "Colorist", value: "Colorist" },
                        { name: "Cover Artist", value: "Cover Artist" },
                      ]}
                    />
                  </ul>
                  <ErrorMessage
                    className="error-message error-text-color wc-error"
                    component="div"
                    name={`workCredits[${index}].credits`}
                  />

                  <button
                    type="button"
                    onClick={() => removeSelectedUser(remove, index)}
                    className="delete-work-credits-button"
                  >
                    <FontAwesomeIcon icon={faTimes} size="2x" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </FieldArray>
    </>
  );
};

// https://codesandbox.io/s/formik-fieldarray-materialui-ig19g?file=/src/form.js:179-186
// https://www.youtube.com/results?search_query=autocomplete+search+bar+react
// https://codeytek.com/live-search-search-react-live-search-in-react-axios-autocomplete-pagination/
// https://stackoverflow.com/questions/41074622/save-array-of-objects-in-state-reactjs
const WorkCredits = ({ identifier }) => {
  const [textSearch, setTextSearch] = useState("");
  const [APIResults, setAPIResults] = useState([]);
  const { errors } = useFormikContext();

  useEffect(() => {
    const searchResults = async () => {
      // send text data to the API call and send back matching results
      try {
        // Unset the APIResults state and do not search if the user did not provide a query string
        if (!textSearch) {
          setAPIResults([]);
          return;
        }
        const res = await searchUser({
          q: textSearch,
          sort: "desc",
          allowDeactivatedUserResults: true,
        });

        // assign results to APIResults state
        setAPIResults(res.data.users);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("failed", err);
      }
    };
    searchResults();
  }, [textSearch]);

  const handleTextInputOnChange = (e) => {
    setTextSearch(e.currentTarget.value);
  };

  const clearTextInput = () => {
    setTextSearch("");
  };

  const workCreditsErrorMessage = () => {
    /*
            This has been added because we are using a Field Array Validation within the WorkCredits Component.
            In order to display the outer error message for this array of objects, this conditional is needed.
            More info here: https://formik.org/docs/api/fieldarray#fieldarray-validation-gotchas
        */
    return typeof errors[identifier] === "string" ? (
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name={identifier}
      />
    ) : null;
  };

  return (
    <div className="work-credits">
      <div className="work-credits-search-container">
        <input
          type="text"
          className="search-bar form-item"
          placeholder="Search Users"
          onChange={handleTextInputOnChange}
          value={textSearch}
        />
        <FontAwesomeIcon icon={faSearch} size="lg" className="search-icon" />
      </div>
      <div className="selected-users">
        <WorkCreditsFields
          identifier={identifier}
          apiResults={APIResults}
          clearTextInput={clearTextInput}
        />
      </div>
      {workCreditsErrorMessage()}
    </div>
  );
};

export default memo(WorkCredits);

/* 
    EXAMPLES OF USE: 

    This component is is designed to be used with formik.

    1. In its most basic form, It can be used like this: 
    (Assuming the formik initial value is this/is not populated with data: 
        initialValues={{
        workCredits: [{ user: '', username: '',  credits: [] }]
    }})
    <WorkCredits identifier="workCredits"  />

    2. This component also allows the user to have values provided by default using the defaultSelectedUsernames prop 
    (Which accepts a string or an array). 
    
    (Assuming the formik initial value is this/ is populated with data: 
        initialValues={{
            workCredits: [{ user: USER_ID,  username: 'USERNAME', credits: ['horror', 'comedy'] }]
        }}
    )
    <WorkCredits identifier="workCredits" defaultSelectedUsernames={defaultSelectedUsernames} />

    the defaultSelectedUsernames prop contains usernames and is typically connected to the state
    in the parent component. It is not added to the formik data 
    (like these:  workCredits: [{ user: '',  username: '', credits: [] }]) because it is not needed it the backend.
    It is purely cosmetic so that the user can see the username.
*/
