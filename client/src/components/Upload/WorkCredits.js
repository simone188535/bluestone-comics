import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './workCredits.scss';


// https://www.youtube.com/results?search_query=autocomplete+search+bar+react
// https://codeytek.com/live-search-search-react-live-search-in-react-axios-autocomplete-pagination/
const WorkCredits = () => {

    return (
        <div className="work-credits">
            <form class="work-credits-search-container">
                <input type="text" className="search-bar form-item" placeholder="Search Users" />
                <FontAwesomeIcon
                    icon={faSearch}
                    size="lg"
                    className="search-icon"
                />
            </form>
        </div>
        );
}


export default WorkCredits;