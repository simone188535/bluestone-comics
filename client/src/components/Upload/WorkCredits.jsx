import React, { useState, useEffect, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext, FieldArray, Field, ErrorMessage } from 'formik';
import { SearchServices } from '../../services';
import Checkboxes from '../CommonUI/Checkboxes';
import './workCredits.scss';

// THESE COMPONENTS WORKS WITH FORMIK.
const RenderSearchList = ({
  push,
  apiResults,
  addSelectedUsername,
  selectedUsernames,
  clearTextInput
}) => {
  // Map though APIResults state and iteratively display list items if they exist OR return nothing

  if (apiResults.length > 0) {
        return (
            <ul className="work-credit-search-list">
                { apiResults.map((item, index) => <SearchedUsers key={index} selectedListItem={item} push={push} addSelectedUsername={addSelectedUsername} selectedUsernames={selectedUsernames} clearTextInput={clearTextInput} />)}
            </ul>
        );
    }
    return null;
}

const SearchedUsers = ({ selectedListItem, push, addSelectedUsername, selectedUsernames, clearTextInput }) => {

    const addSelectedUser = (selectedListItem, push) => {
        
        // if the Selected User was not already selected, push it to selectedUsernames state and formik workCredits value
        if(!selectedUsernames.includes(selectedListItem.username)) {
            // When a list item is selected, append it to the selectedUsernames state and push to formik workCredits array value
           
            addSelectedUsername(selectedListItem.username);
            push({ user: selectedListItem._id, credits: [] });
            // clear out text search
            clearTextInput();
        } else {
            clearTextInput();
            return false;
        }
    }

    return <li className="work-credit-search-list-item" onClick={() => addSelectedUser(selectedListItem, push)}>{selectedListItem.username}</li>;
}

const WorkCreditsFields = ({ identifier, apiResults, defaultSelectedUsernames, clearTextInput }) => {

    const [selectedUsernames, setSelectedUsernames] = useState([]);
    const { values } = useFormikContext();
    useEffect(() => {
        /* 
            This adds an inital/default value to the work credits array. If the defaultSelectedUsernames prop is populated
            it is added to the state. This prevents the user from having to search their own username when adding work credits. 
        */
        if (defaultSelectedUsernames) {
            addSelectedUsername(defaultSelectedUsernames);
        }

    }, [defaultSelectedUsernames]);

    const addSelectedUsername = (selectedListItemUsername) => {
        
        // When a list item is selected, append it to the selectedUsernames state
        const userNameToAddToSelectedUsernamesState = (selectedListItemUsername) => setSelectedUsernames(prevState => [...prevState, selectedListItemUsername]);

        // This conditional was added to allow an array of values to be added to the user state if needed
        if (selectedListItemUsername instanceof Array) {
            selectedListItemUsername.forEach((username) => userNameToAddToSelectedUsernamesState(username));
        } else {
            userNameToAddToSelectedUsernamesState(selectedListItemUsername);
        }
    }

    const removeSelectedUser = (remove, index) => {
        // When the remove button is selected, remove it to the selectedUsernames state (using the index), and remove from formik
        remove(index);
        setSelectedUsernames(prevState => prevState.filter((username, i) => i !== index));
    }

    return (
        <FieldArray name={identifier}>
            {({ push, remove }) => (
                <div>
                    <>
                        <RenderSearchList 
                            apiResults={apiResults} 
                            push={push} 
                            addSelectedUsername={addSelectedUsername} 
                            selectedUsernames={selectedUsernames} 
                            clearTextInput={clearTextInput}
                        />
                    </>
                    {values.workCredits.map((p, index) => {
                        // console.log('ppppppp', p);
                        return (
                            <div key={index} className="work-credit-selected-search-list-item">
                                <div className="username">{selectedUsernames[index]}</div>

                                {/* This input contains the users ID */}
                                <Field
                                    className="user-input"
                                    name={`workCredits[${index}].user`}
                                    value={p.user}
                                />
                                <ErrorMessage className="error-message error-text-color wc-error" component="div" name={`workCredits[${index}].user`} />
                                 <div className="info-head">
                                    While creating this work, this user fulfilled the role(s) of: 
                                </div>
                                <ul className="work-credits-checkbox-section">
                                    <Checkboxes
                                        identifier={`workCredits[${index}].credits`}
                                        type="multiple"
                                        wrapperElement="li"
                                        checkboxValue={[
                                            { name: 'Writer' },
                                            { name: 'Artist' },
                                            { name: 'Editor' },
                                            { name: 'Inker' },
                                            { name: 'Letterer' },
                                            { name: 'Penciller' },
                                            { name: 'Colorist' },
                                            { name: 'Cover Artist' }
                                        ]} />
                                    </ul>
                                <ErrorMessage className="error-message error-text-color wc-error" component="div" name={`workCredits[${index}].credits`} />

                                <button type="button" onClick={() => removeSelectedUser(remove, index)} className="delete-work-credits-button">
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        size="2x"
                                    />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </FieldArray>
    )
}

// https://codesandbox.io/s/formik-fieldarray-materialui-ig19g?file=/src/form.js:179-186
// https://www.youtube.com/results?search_query=autocomplete+search+bar+react
// https://codeytek.com/live-search-search-react-live-search-in-react-axios-autocomplete-pagination/
// https://stackoverflow.com/questions/41074622/save-array-of-objects-in-state-reactjs
const WorkCredits = ({ identifier, defaultSelectedUsernames }) => {
    const [textSearch, setTextSearch] = useState('');
    const [APIResults, setAPIResults] = useState([]);

    useEffect(() => {
        searchResults();
    }, [textSearch]);

    const handleTextInputOnChange = (e) => {
        setTextSearch(e.currentTarget.value);
    }

    const clearTextInput = () => {
        setTextSearch('');
    }

    const searchResults = async () => {
        // send text data to the API call and send back matching results
        try {

            // Unset the APIResults state and do not search if the user did not provide a query string
            if (!(textSearch) && APIResults) {
                setAPIResults([]);
                return;

            } else {

                const res = await SearchServices.searchUser(textSearch);

                // assign results to APIResults state
                setAPIResults(res.data.users);
            }
        } catch (err) {
            console.log('failed', err.response.data.message);
        }
    }

    return (
        <div className="work-credits">
            <div className="work-credits-search-container">
                <input type="text" className="search-bar form-item" placeholder="Search Users" onChange={handleTextInputOnChange} value={textSearch}/>
                <FontAwesomeIcon
                    icon={faSearch}
                    size="lg"
                    className="search-icon"
                />
            </div>
            <div className="selected-users">
                <WorkCreditsFields 
                    identifier={identifier} 
                    apiResults={APIResults} 
                    defaultSelectedUsernames={defaultSelectedUsernames} 
                    clearTextInput={clearTextInput}
                />
            </div>
        </div>
    );
}


export default memo(WorkCredits);

/* 
    EXAMPLES OF USE: 

    This component is is designed to be used with formik.

    1. In its most basic form, It can be used like this: 
    (Assuming the formik initial value is this/is not populated with data: 
        initialValues={{
        workCredits: [{ user: '', credits: [] }]
    }})
    <WorkCredits identifier="workCredits"  />

    2. This component also allows the user to have values provided by default using the defaultSelectedUsernames prop 
    (Which accepts a string or an array). 
    
    (Assuming the formik initial value is this/ is populated with data: 
        initialValues={{
            workCredits: [{ user: USER_ID, credits: ['horror', 'comedy'] }]
        }}
    )
    <WorkCredits identifier="workCredits" defaultSelectedUsernames={defaultSelectedUsernames} />

    the defaultSelectedUsernames prop contains usernames and is typically connected to the state
    in the parent component. It is not added to the formik data 
    (like these:  workCredits: [{ user: '', credits: [] }]) because it is not needed it the backend.
    It is purely cosmetic so that the user can see the username.
*/