import React, { useEffect, useState } from 'react';
import { SearchServices } from '../../../../services';
import './works.scss';

const Works = ({ profilePageUser }) => {
     // This may be passed as a props later from the profile page
    const buttonValues = ['Books', 'Issues', 'Accredited'];
    
    const [activeButton, setActiveButton] = useState(0);
    const [filterType, setFilterType] = useState(buttonValues[0]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchSearchType = async () => {
        try {
            switch (filterType) {
                case 'Books':
                    const booksByProfileUser = SearchServices.searchBooks({});

                    setFilteredResults(booksByProfileUser);
                    break;
                case 'Issues':
                    const issuesByProfileUser = SearchServices.searchIssues({});

                    setFilteredResults(issuesByProfileUser);
                    break;
                case 'Accredited':
                    const AccreditedWorksByProfileUser = SearchServices.searchIssues({});

                    setFilteredResults(AccreditedWorksByProfileUser);
                    break;
                default:
                    return;
            }

        } catch (err) {
            setErrorMessage('An error occurred. Please try again later.');
        }
    };
    useEffect(() => {
        fetchSearchType();
    }, [filterType])


    const filterButtons = () => {
        return buttonValues.map((element, index) => {
            const activeClassToggle = index === activeButton ? 'active' : '';

            return <button key={index} className={`bsc-button transparent works-tab-tri-button ${activeClassToggle}`} onClick={() => toggleActiveElement(index, element)}>{element}</button>
        })
    }

    const toggleActiveElement = (activeButtonIndex, activeButtonValue) => {
        setActiveButton(activeButtonIndex);
        setFilterType(activeButtonValue);
    }

    return (
        <div className="works-tab">
            <div className="works-tab-tri-buttons-container">
                {filterButtons()}
            </div>
            <div className="filtered-results">

            </div>
        </div>
    );
}

export default Works;