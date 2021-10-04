import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import { searchBooks, searchIssues } from "../../../../services";
import ReadMore from "../../../CommonUI/ReadMore";
import useBelongsToCurrentUser from "../../../../hooks/useBelongsToCurrentUser";
import useCurrentPageResults from "../../../../hooks/useCurrentPageResults";
import Pagination from "../../../CommonUI/Pagination";
import "./works.scss";

// const DisplaySelectedWorks = (Component) => {

//   return Component;
// }

const Accredited = (filteredResults) => {
  return <div>Accredited</div>;
};

const BooksOrIssues = ({ profilePageUserId, filteredResults }) => {
  const belongsToCurrentUser = useBelongsToCurrentUser(profilePageUserId);
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 12;

  const editButtonIfWorkBelongsToUser = belongsToCurrentUser ? (
    <button type="button" className="edit-button">
      <a href="#">
        <strong>Edit</strong>
      </a>
    </button>
  ) : null;

  const currentResultsDisplayed = useCurrentPageResults(
    currentPage,
    filteredResults,
    PageSize
  );

  // BUG May need to clear filtered result when changing filterType
  // BUG sort results by most recent
  const searchResults = currentResultsDisplayed?.map((currentResult) => (
    <li
      className="grid-list-item"
      key={`filtered-result-${currentResult.book_id || currentResult.issue_id}`}
    >
      {/* {console.log('!!!!!!!! ', currentResult)} */}
      <div className="grid-image-container">
        <a href="#">
          <img
            className="grid-image"
            src={currentResult.cover_photo}
            alt={`${currentResult.title}`}
          />
        </a>
      </div>
      <div className="grid-info-box">
        <div className="grid-info-box-header-container">
          <h3 className="grid-info-box-header">{currentResult.title}</h3>
        </div>
        <div className="grid-info-box-body">
          <ReadMore
            content={currentResult.description}
            maxStringLengthShown={100}
          />
        </div>
        <div className="grid-info-box-date-created">
          {moment(currentResult.date_created).format("MMMM D, YYYY")}
        </div>
        <div className="grid-footer">{editButtonIfWorkBelongsToUser}</div>
      </div>
    </li>
  ));

  const displayFilteredResults = filteredResults ? (
    <ul className="display-work-grid col-4">{searchResults}</ul>
  ) : (
    <span>This user has not created this yet.</span>
  );

  return (
    <>
      <div className="filtered-results">{displayFilteredResults}</div>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={filteredResults.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};
const Works = ({ profilePageUsername, profilePageUserId }) => {
  // This may be passed as a props later from the profile page
  const buttonValues = ["Books", "Issues", "Accredited"];

  const [activeButton, setActiveButton] = useState(0);
  const [filterType, setFilterType] = useState(buttonValues[0]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  // const belongsToCurrentUser = useBelongsToCurrentUser(profilePageUserId);

  // BUG Dont forget error message
  const fetchSearchType = async () => {
    try {
      switch (filterType) {
        case "Books": {
          const booksByProfileUser = await searchBooks({
            username: profilePageUsername,
            sort: "desc",
          });
          const { books } = booksByProfileUser.data;

          setFilteredResults(books);
          break;
        }
        case "Issues": {
          const issuesByProfileUser = await searchIssues({
            username: profilePageUsername,
            sort: "desc",
          });
          const { issues } = issuesByProfileUser.data;

          setFilteredResults(issues);
          break;
        }
        case "Accredited": {
          // const AccreditedWorksByProfileUser = await SearchServices.searchIssues({username: profilePageUsername});
          // const { issues } = AccreditedWorksByProfileUser.data;
          // setFilteredResults(issues);
          break;
        }
        default:
          return;
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };
  useEffect(() => {
    fetchSearchType();
  }, [filterType]);

  // useEffect(() => {
  //     console.log('filteredResults: ', filteredResults)
  // }, [filteredResults])

  const toggleActiveElement = (activeButtonIndex, activeButtonValue) => {
    setActiveButton(activeButtonIndex);
    setFilterType(activeButtonValue);
  };

  // Select the current/active button and update the state
  const filterButtons = buttonValues.map((element, index) => {
    const activeClassToggle = index === activeButton ? "active" : "";

    return (
      <button
        type="button"
        key={`filter-button-${element}`}
        className={`bsc-button primary works-tab-tri-button ${activeClassToggle}`}
        onClick={() => toggleActiveElement(index, element)}
      >
        {element}
      </button>
    );
  });

  // const displayFilteredResults ;
  // useEffect(() => {
  //     displayFilteredResults();
  // }, [displayFilteredResults, filterType]);

  return (
    <>
      <div className="works-tab">
        <div className="works-tab-tri-buttons-container">{filterButtons}</div>
        {/* HOC OR COMPONNENT CONDITIONAL GO HERE */}
        {/* <Accredited /> */}
        <BooksOrIssues
          profilePageUserId={profilePageUserId}
          filteredResults={filteredResults}
        />
      </div>
    </>
  );
};

export default Works;
