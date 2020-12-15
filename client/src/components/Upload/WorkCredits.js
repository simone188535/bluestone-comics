import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SearchServices } from '../../services';
import './workCredits.scss';


// https://www.youtube.com/results?search_query=autocomplete+search+bar+react
// https://codeytek.com/live-search-search-react-live-search-in-react-axios-autocomplete-pagination/
const WorkCredits = () => {
    const [textSearch, setTextSearch] = useState('');
    const [APIResults, setAPIResults] = useState([]);

    const handleTextInputOnChange = (e) => {
        setTextSearch(e.currentTarget.value);
    }

    useEffect(() => {
        searchResults();
    }, [textSearch]);

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

    const selectedUserClicked = (selectedListItem) => {
        console.log('!!!!!!!!!', selectedListItem);
    }

    const renderSearchList = () => {

        // Map though APIResults state and iteratively display list items if they exist OR return nothing

        if (APIResults.length > 0) {
            return (
                <ul className="work-credit-search-list">
                    { APIResults.map((item, index) => <li key={index} className="work-credit-search-list-item" onClick={() => selectedUserClicked(item)}>{item.username}</li>)}
                </ul>
            );
        } 
        return null;
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
            <>
                {renderSearchList()}
            </>
        </div>
    );
}


export default WorkCredits;