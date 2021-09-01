import React, { useEffect, useState } from 'react';
import { SearchServices } from '../../../../services';
import ReadMore from '../../../CommonUI/ReadMore';
import moment from 'moment';
import './works.scss';

const Works = ({ profilePageUsername }) => {
    // This may be passed as a props later from the profile page
    const buttonValues = ['Books', 'Issues', 'Accredited'];

    const [activeButton, setActiveButton] = useState(0);
    const [filterType, setFilterType] = useState(buttonValues[0]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    // BUG Dont forget error message

    const fetchSearchType = async () => {
        try {
            switch (filterType) {
                case 'Books':
                    const booksByProfileUser = await SearchServices.searchBooks({ username: profilePageUsername });
                    const { books } = booksByProfileUser.data;

                    setFilteredResults(books);
                    break;
                case 'Issues':
                    const issuesByProfileUser = await SearchServices.searchIssues({ username: profilePageUsername });
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

    // useEffect(() => {
    //     console.log('filteredResults: ', filteredResults)
    // }, [filteredResults])

    const filterButtons = buttonValues.map((element, index) => {
        const activeClassToggle = index === activeButton ? 'active' : '';

        return <button key={`filter-button-${index}`} className={`bsc-button primary works-tab-tri-button ${activeClassToggle}`} onClick={() => toggleActiveElement(index, element)}>{element}</button>
    })

    const toggleActiveElement = (activeButtonIndex, activeButtonValue) => {
        setActiveButton(activeButtonIndex);
        setFilterType(activeButtonValue);
    }


    // BUG May need to clear filtered result when changing filterType
    const results = filteredResults.map((filteredResult, index) => (
        <li className="grid-list-item" key={`filtered-result-${index}`}>
            <div className="grid-image-container">
                <a href="#">
                    <img className="grid-image" src={filteredResult.cover_photo} alt={`${filteredResult.title} cover photo`} />
                </a>
            </div>
            <div className="grid-info-box">
                <h3 className="grid-info-box-header">{filteredResult.title}</h3>
                <div className="grid-info-box-body">
                    <ReadMore content={filteredResult.description} maxStringLengthShown={150} />
                </div>
                <div className="grid-info-box-date-created">
                    {moment(filteredResult.date_created).format('MMMM D, YYYY')}
                </div>
                <div className="grid-footer">

                </div>
            </div>
        </li>
    ));

    const displayFilteredResults = (filteredResults) ? (<ul className="display-work-grid col-4">{results}</ul>) : (<span>This user has not created this yet.</span>);


    // const displayFilteredResults ;
    // useEffect(() => {
    //     displayFilteredResults();
    // }, [displayFilteredResults, filterType]);

    return (
        <div className="works-tab">
            <div className="works-tab-tri-buttons-container">
                {filterButtons}
            </div>
            <div className="filtered-results">
                {displayFilteredResults}
            </div>
        </div>
    );
}

export default Works;