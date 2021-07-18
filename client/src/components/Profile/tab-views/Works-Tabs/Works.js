import React, { useEffect, useState } from 'react';
import { SearchServices } from '../../../../services';
import './works.scss';

const Works = ({ profilePageUsername }) => {
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
                    const booksByProfileUser = await SearchServices.searchBooks({username: profilePageUsername});
                    const { books } = booksByProfileUser.data;

                    setFilteredResults(books);
                    break;
                case 'Issues':
                    const issuesByProfileUser = await SearchServices.searchIssues({username: profilePageUsername});
                    const { issues } = issuesByProfileUser.data;

                    setFilteredResults(issues);
                    break;
                case 'Accredited':
                    //const AccreditedWorksByProfileUser = await SearchServices.searchIssues({username: profilePageUsername});
                    // const { issues } = AccreditedWorksByProfileUser.data;
                    // setFilteredResults(issues);
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

    useEffect(() => {
        console.log('filteredResults: ', filteredResults)
    }, [filteredResults])

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