import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  searchBooks,
  searchIssues,
  searchAccreditedWorks,
} from "../../../../services";
// import ReadMore from "../../../CommonUI/ReadMore";
import useCurrentPageResults from "../../../../hooks/useCurrentPageResults";
import Pagination from "../../../CommonUI/Pagination";
import LoadingSpinner from "../../../CommonUI/LoadingSpinner";
import ErrorMessage from "../../../CommonUI/ErrorMessage";
import Accordion from "../../../CommonUI/Accordion";
import "./works.scss";

const PAGINATION_LIMIT = 12;

const Accredited = ({ filteredResults }) => {
  // TODO: reduce the time complexity of this function, it is 0(n) + 0(n^2). It can be more efficient
  const accreditedData = filteredResults
    // if the user has not works in the given a comic role, do not return the array
    .filter(
      (accreditedWork) => accreditedWork[Object.keys(accreditedWork)].length > 0
    )
    .map((accreditedWork, index) => {
      const accreditedWorkKey = Object.keys(accreditedWork);
      const accreditedWorkKeyAsString = accreditedWorkKey[0];
      const allAccreditedWorkValues = accreditedWork[accreditedWorkKey];

      // if object key contains _ remove it, make name uppercase and then add it to the array data
      const header = `${accreditedWorkKeyAsString.replace("_", " ")} (${
        allAccreditedWorkValues.length
      })`;

      // map through current allAccreditedWorkValues and return the html containing all the work details for this specific role
      const description = allAccreditedWorkValues.map(
        (worksUserParticipatedIn) => {
          return {
            id: `${accreditedWorkKeyAsString}-${worksUserParticipatedIn.book_id}-${worksUserParticipatedIn.issue_id}`,
            listItem: `<ul class="accredited-work-group"><li class="accredited-work-group-item">Issue: <a href="#" class="accredited-work-group-item-link">${worksUserParticipatedIn.issue_title}</a></li> <li class="class="accredited-work-group-item">Issue # : ${worksUserParticipatedIn.issue_number}</li> <li class="accredited-work-group-item">Book: <a href="#" class="accredited-work-group-item-link">${worksUserParticipatedIn.book_title}</a></li></ul>`,
          };
        }
      );

      return {
        id: `${accreditedWorkKeyAsString}-${index}`,
        header,
        description,
      };
    });

  return (
    <>
      {/* <h3>this creator has fulfilled the following roles:</h3> */}
      {/* {console.log("accreditedData ", accreditedData)} */}
      <div>
        <Accordion
          AccordianData={accreditedData}
          className="accredited-works-accordian"
        />
      </div>
    </>
  );
};

const BooksOrIssues = ({
  // profilePageUserId,
  filteredResults,
  filterType,
  currentPage,
  setPage,
}) => {
  const currentResultsDisplayed = useCurrentPageResults(
    currentPage,
    filteredResults,
    PAGINATION_LIMIT
  );

  const searchResults = currentResultsDisplayed?.map((currentResult) => {
    const showFirstHeaderWithBooksorIssueTitle =
      filterType === "Books" ? (
        <h3 className="grid-info-box-header">
          <Link to="#" className="grid-info-box-header-link">
            {currentResult.book_title}
          </Link>
        </h3>
      ) : (
        <h3 className="grid-info-box-header">
          <Link to="#" className="grid-info-box-header-link">
            {currentResult.issue_title}
          </Link>
        </h3>
      );

    const showSecondHeaderWithBookTitle =
      filterType === "Issues" ? (
        <h4 className="grid-info-box-header">
          <Link to="#" className="grid-info-box-header-link">
            {currentResult.book_title}
          </Link>
        </h4>
      ) : null;
    return (
      <li
        className="grid-list-item"
        key={`filtered-result-${
          currentResult.book_id || currentResult.issue_id
        }`}
      >
        <div className="grid-image-container">
          <Link to="#">
            <img
              className="grid-image"
              src={currentResult.cover_photo}
              alt={`${currentResult.title}`}
            />
          </Link>
        </div>
        <div className="grid-info-box">
          <div className="grid-info-box-header-container">
            {showFirstHeaderWithBooksorIssueTitle}
            {showSecondHeaderWithBookTitle}
            <div className="grid-info-box-date-created">
              {moment(currentResult.date_created).format("MMMM D, YYYY")}
            </div>
          </div>
          {/* <div className="grid-info-box-body">
          <ReadMore
            content={currentResult.description}
            maxStringLengthShown={100}
          />
        </div> */}
          {/* <div className="grid-info-box-date-created">
          {moment(currentResult.date_created).format("MMMM D, YYYY")}
        </div> */}
          {/* <div className="grid-footer">{editButtonIfWorkBelongsToUser}</div> */}
        </div>
      </li>
    );
  });

  const showCurrentSearchPageDataIfPresent = filteredResults ? (
    <ul className="display-work-grid col-4">{searchResults}</ul>
  ) : (
    <span>This user has not created this yet.</span>
  );

  return (
    <>
      <div className="filtered-results">
        {showCurrentSearchPageDataIfPresent}
      </div>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        // BUG total results needs to be passed here (memoizing might help):
        // I might not have to do any of thats at all since I commented out limit and page in fetchSearchType ?
        // https://cloudnweb.dev/2021/04/pagination-nodejs-mongoose/
        // https://www.youtube.com/watch?v=yY1n0sDZPtI
        totalCount={filteredResults.length}
        pageSize={PAGINATION_LIMIT}
        onPageChange={setPage}
      />
    </>
  );
};

const DisplaySelectedWorks = React.memo(
  ({
    filterType,
    filteredResults,
    profilePageUserId,
    currentPage,
    setPage,
  }) => {
    if (filterType === "Accredited") {
      return <Accredited filteredResults={filteredResults} />;
    }
    return (
      <BooksOrIssues
        profilePageUserId={profilePageUserId}
        filteredResults={filteredResults}
        filterType={filterType}
        currentPage={currentPage}
        setPage={setPage}
      />
    );
  }
);

const Works = ({ profilePageUsername, profilePageUserId }) => {
  // This may be passed as a props later from the profile page
  const buttonValues = ["Books", "Issues", "Accredited"];

  const [activeButton, setActiveButton] = useState(0);
  const [filterType, setFilterType] = useState(buttonValues[0]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [errorMessageStatus, setErrorMessageStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // loading state can be set here too
  const fetchSearchType = useCallback(async () => {
    try {
      switch (filterType) {
        case "Books": {
          setLoadingStatus(true);

          const booksByProfileUser = await searchBooks({
            username: profilePageUsername,
            sort: "desc",
          });

          const { books } = booksByProfileUser.data;

          setLoadingStatus(false);
          setFilteredResults(books);
          break;
        }
        case "Issues": {
          setLoadingStatus(true);

          const issuesByProfileUser = await searchIssues({
            username: profilePageUsername,
            sort: "desc",
          });

          const { issues } = issuesByProfileUser.data;

          setLoadingStatus(false);
          setFilteredResults(issues);
          break;
        }
        case "Accredited": {
          setLoadingStatus(true);

          const searchAccreditedWorksRes = await searchAccreditedWorks(
            profilePageUserId
          );
          const {
            artist,
            colorist,
            coverArtist,
            editor,
            inker,
            letterer,
            penciller,
            writer,
          } = searchAccreditedWorksRes.data;

          setFilteredResults([
            { artist },
            { colorist },
            { cover_Artist: coverArtist },
            { editor },
            { inker },
            { letterer },
            { penciller },
            { writer },
          ]);
          setLoadingStatus(false);

          break;
        }
        default: {
          return;
        }
      }
    } catch (err) {
      setErrorMessageStatus(true);
    }
  }, [filterType, profilePageUserId, profilePageUsername]);

  useEffect(() => {
    fetchSearchType();
  }, [fetchSearchType, filterType]);

  // useEffect(() => {
  //   console.log("filteredResults useEffect: ", filteredResults);
  // }, [filteredResults]);

  const setPage = (page) => setCurrentPage(page);

  const toggleActiveElement = (currentButtonIndex, currentButtonValue) => {
    // if the active button is already clicked, do nothing;
    if (currentButtonIndex === activeButton) return;

    setActiveButton(currentButtonIndex);
    // reset pagination and clear filtered search results when a new button is clicked
    setCurrentPage(1);
    setFilteredResults([]);
    setFilterType(currentButtonValue);
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

  const statusOfDataRetrieval = () => {
    let renderStatusOfDataRetrieval;

    if (errorMessageStatus) {
      // when an error occurs during data fetching
      renderStatusOfDataRetrieval = (
        <ErrorMessage
          errorStatus={errorMessageStatus}
          MessageText="An error occurred. Please try again later."
        />
      );
    } else if (loadingStatus) {
      //  while data fetching is occuring
      renderStatusOfDataRetrieval = (
        <LoadingSpinner loadingStatus={loadingStatus} />
      );
    } else if (filteredResults.length) {
      // when data fetching is completed
      renderStatusOfDataRetrieval = (
        <DisplaySelectedWorks
          filterType={filterType}
          filteredResults={filteredResults}
          profilePageUserId={profilePageUserId}
          currentPage={currentPage}
          setPage={setPage}
        />
      );
    }

    return renderStatusOfDataRetrieval;
  };

  return (
    <>
      <div className="works-tab">
        <div className="works-tab-tri-buttons-container">{filterButtons}</div>
        {statusOfDataRetrieval()}
      </div>
    </>
  );
};

export default Works;
