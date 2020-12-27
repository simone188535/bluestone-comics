import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SearchServices } from '../../services';
import Checkboxes from '../CommonUI/Checkboxes.js';
import { FieldArray, Field, ErrorMessage } from 'formik';
import './workCredits.scss';


const RenderSearchList = ({ push, apiResults, addSelectedUsername }) => {
    // Map though APIResults state and iteratively display list items if they exist OR return nothing

    if (apiResults.length > 0) {
        return (
            <ul className="work-credit-search-list">
                {/* { APIResults.map((item, index) => <li key={index} className="work-credit-search-list-item" onClick={() => selectedUser(item, push)}>{item.username}</li>)} */}
                { apiResults.map((item, index) => <SearchedUsers key={index} selectedListItem={item} push={push} addSelectedUsername={addSelectedUsername} />)}
            </ul>
        );
    }
    return null;
}

const SearchedUsers = ({ selectedListItem, push, addSelectedUsername }) => {

    const addSelectedUser = (selectedListItem, push) => {
        // When a list item is selected, append it to the selectedUsernames state and push to formik workCredits array value

        addSelectedUsername(selectedListItem);
        // push({ user: selectedListItem._id, credits: ['horror', 'drama'] });
        push({ user: selectedListItem._id, credits: [] });
        // clear out text search
    }

    return <li className="work-credit-search-list-item" onClick={() => addSelectedUser(selectedListItem, push)}>{selectedListItem.username}</li>;
}

const WorkCreditsFields = ({ identifier, apiResults, formikValues, defaultSelectedUsername }) => {

    const [selectedUsernames, setSelectedUsernames] = useState(() => {
        // Return the defaultSelectedUsername in an array or return an empty array
        const initialState = defaultSelectedUsername ? [defaultSelectedUsername] : [];
        return initialState;
    });

    useEffect(() => {
        console.log({ selectedUsernames });
    }, [selectedUsernames]);

    const addSelectedUsername = (selectedListItem) => {
        // When a list item is selected, append it to the selectedUsernames state
        setSelectedUsernames(prevState => [...prevState, selectedListItem.username]);
    }

    const removeSelectedUser = (remove, index) => {
        // When the remove button is selected, remove it to the selectedUsernames state, and remove from formik
        remove(index);
        // use index to remove username from state
        setSelectedUsernames(prevState => prevState.filter((username, i) => i !== index));
    }

    return (
        <FieldArray name={identifier}>
            {({ push, remove }) => (
                <div>
                    <>
                        <RenderSearchList apiResults={apiResults} push={push} addSelectedUsername={addSelectedUsername} />
                    </>
                    {formikValues.workCredits.map((p, index) => {
                        // console.log('ppppppp', p);
                        return (
                            <div key={index} className="work-credit-selected-search-list-item">
                                <div className="username">{selectedUsernames[index]}</div>

                                {/* This input contains the user ID */}
                                <Field
                                    className="user-input"
                                    name={`workCredits[${index}].user`}
                                    value={p.user}
                                />
                                <ErrorMessage className="error-message error-text-color" component="div" name={`workCredits[${index}].user`} />
                                <Checkboxes
                                    identifier={`workCredits[${index}].credits`}
                                    type="multiple"
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
                                <ErrorMessage className="error-message error-text-color" component="div" name={`workCredits[${index}].credits`} />

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
const WorkCredits = ({ identifier, formikValues, defaultSelectedUsername }) => {
    const [textSearch, setTextSearch] = useState('');
    const [APIResults, setAPIResults] = useState([]);

    useEffect(() => {
        searchResults();
    }, [textSearch]);

    const handleTextInputOnChange = (e) => {
        setTextSearch(e.currentTarget.value);
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
                <input type="text" className="search-bar form-item" placeholder="Search Users" onChange={handleTextInputOnChange} />
                <FontAwesomeIcon
                    icon={faSearch}
                    size="lg"
                    className="search-icon"
                />
            </div>
            <div className="selected-users">
                <WorkCreditsFields identifier={identifier} apiResults={APIResults} formikValues={formikValues} defaultSelectedUsername={defaultSelectedUsername} />
            </div>
        </div>
    );
}


export default WorkCredits;