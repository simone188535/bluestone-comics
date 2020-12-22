import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SearchServices } from '../../services';
// import Checkboxes from '../CommonUI/Checkboxes.js';
import { FieldArray, getIn, Field } from 'formik';
import './workCredits.scss';

// https://codesandbox.io/s/formik-fieldarray-materialui-ig19g?file=/src/form.js:179-186
// https://www.youtube.com/results?search_query=autocomplete+search+bar+react
// https://codeytek.com/live-search-search-react-live-search-in-react-axios-autocomplete-pagination/
// https://stackoverflow.com/questions/41074622/save-array-of-objects-in-state-reactjs
const WorkCredits = ({ identifier, formikValues }) => {
    const [textSearch, setTextSearch] = useState('');
    const [APIResults, setAPIResults] = useState([]);
    const [selectedUserNames, setSelectedUserNames] = useState([]);

    useEffect(() => {
        searchResults();
    }, [textSearch]);

    // useEffect(() => {
    //     console.log('!!!!!', selectedUserWorkCredits);
    // }, [selectedUserWorkCredits]);

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
            }

            const res = await SearchServices.searchUser(textSearch);

            // assign results to APIResults state
            setAPIResults(res.data.users);
            // console.log('success', res.data.users);
        } catch (err) {
            console.log('failed', err.response.data.message);
        }
    }

    const renderSearchList = (push) => {
        // Map though APIResults state and iteratively display list items if they exist OR return nothing

        if (APIResults.length > 0) {
            return (
                <ul className="work-credit-search-list">
                    { APIResults.map((item, index) => <li key={index} className="work-credit-search-list-item" onClick={() => selectedUser(item, push)}>{item.username}</li>)}
                </ul>
            );
        }
        return null;
    }

    const selectedUser = (selectedListItem, push) => {
        // console.log('!!!!!!!!!', selectedListItem);
        push({ user: selectedListItem._id, credits: ['horror', 'drama'] });
        // clear value of search bar
        // push object to selectedUserWorkCredits array

        // do not allow duplicates in state
        // setSelectedUserWorkCredits(prevState => (
        //     [...prevState, {"user": selectedListItem._id, "credits": []}]
        // ));
    }

    const renderSelectedUsers = (identifier, formikValues) => {
        console.log(formikValues)
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
                <FieldArray name={identifier}>
                    {({ push, remove }) => (
                        <div>
                            <>
                                {renderSearchList(push)}
                            </>
                            {formikValues.workCredits.map((p, index) => {
                                const firstName = `contact`;

                                const lastName = `test`;

                                return (
                                    <div key={index}>
                                        <Field
                                            label="First name"
                                            name={firstName}
                                            value={p.firstName}
                                            required
                                        />
                                        <Field
                                            name={lastName}
                                            value={p.lastName}
                                            required
                                        />
                                        <button
                                            margin="normal"
                                            type="button"
                                            onClick={() => remove(index)}
                                        >x</button>
                                    </div>
                                );
                            })}

                            {/* <button type="button" onClick={() => push({ id: Math.random(), firstName: "", lastName: "" })} >Add </button> */}
                        </div>
                    )}
                </FieldArray>
            </div>
        </div>
    );
}


export default WorkCredits;