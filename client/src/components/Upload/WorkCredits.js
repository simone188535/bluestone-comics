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

            // Unset APIResults and do not search if the user did not provide a query string
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

    const renderSearchList = () => {
        // Map though APIResults state and iteratively display list items
        return APIResults.map((item, index) => <li key={index}>{item.username}</li>);
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
            <ul>
                {renderSearchList()}
            </ul>
        </div>
    );
}


export default WorkCredits;