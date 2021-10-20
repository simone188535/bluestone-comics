import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  searchBooks,
  searchIssues,
  searchAccreditedWorks,
} from "../../../../services";
import ReadMore from "../../../CommonUI/ReadMore";
import useBelongsToCurrentUser from "../../../../hooks/useBelongsToCurrentUser";
import useCurrentPageResults from "../../../../hooks/useCurrentPageResults";
import Pagination from "../../../CommonUI/Pagination";
import LoadingSpinner from "../../../CommonUI/LoadingSpinner";
import ErrorMessage from "../../../CommonUI/ErrorMessage";
import Accordion from "../../../CommonUI/Accordion";
import "./works.scss";

const PAGINATION_LIMIT = 12;

const Accredited = ({ filteredResults }) => {
  console.log("filteredResults", filteredResults);
  return (
    <>
      <div>Accredited</div>
      <div>
        <Accordion />
      </div>
    </>
  );
};

const BooksOrIssues = ({
  profilePageUserId,
  filteredResults,
  currentPage,
  setPage,
}) => {
  const belongsToCurrentUser = useBelongsToCurrentUser(profilePageUserId);
  // const [currentPage, setCurrentPage] = useState(1);
  // const PageSize = 12;

  const currentResultsDisplayed = useCurrentPageResults(
    currentPage,
    filteredResults,
    PAGINATION_LIMIT
  );

  const editButtonIfWorkBelongsToUser = belongsToCurrentUser ? (
    <button type="button" className="edit-button">
      <a href="#">
        <strong>Edit</strong>
      </a>
    </button>
  ) : null;

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
  const fetchSearchType = async () => {
    try {
      switch (filterType) {
        case "Books": {
          setLoadingStatus(true);

          // throw new Error("problem");
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

          const AccreditedWorksByProfileUser = await searchAccreditedWorks(
            profilePageUserId
          );
          // const { issues } = AccreditedWorksByProfileUser.data;

          setLoadingStatus(false);
          // setFilteredResults(issues);
          break;
        }
        default:
          return;
      }
    } catch (err) {
      setErrorMessageStatus(true);
    }
  };
  useEffect(() => {
    fetchSearchType();
  }, [filterType]);

  const setPage = (page) => setCurrentPage(page);

  const toggleActiveElement = (activeButtonIndex, activeButtonValue) => {
    setActiveButton(activeButtonIndex);

    // reset pagination when a new button is clicked
    setCurrentPage(1);
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
