import React, { useEffect, useState } from "react";
import moment from "moment";
import { nanoid } from "nanoid";
import { useParams, Link } from "react-router-dom";
import {
  getBookWorkCredits,
  getIssueWorkCredits,
  getGenres,
} from "../../services";
import Accordion from "../CommonUI/Accordion";

const ExtraInfo = ({
  isIssue,
  issueNum,
  dateCreated,
  lastUpdated,
  totalIssuePages,
}) => {
  const { urlSlug, bookId, issueNumber } = useParams();
  const [workCredits, setWorkCredits] = useState([]);
  const [genreList, setGenreList] = useState([]);
  // // const [errMsg, setErrMsg] = useState("");
  const className = isIssue ? "half" : "whole";

  const filterOutEmptyWorkCreditsObj = () => {
    return (
      workCredits
        // if the user has not works in the given a comic role, do not return the array
        .filter((workCredit) => workCredit[Object.keys(workCredit)].length > 0)
    );
  };

  useEffect(() => {
    (async () => {
      try {
        /* 
          create call for based off whether the details page is for book or issue and set the Work Credits 
          from the api call to state.
          */
        const appropriateWorkCreditsCall = isIssue
          ? await getIssueWorkCredits(urlSlug, bookId, issueNumber)
          : await getBookWorkCredits(urlSlug, bookId);

        const {
          writers,
          artists,
          editors,
          inkers,
          letterers,
          pencillers,
          colorists,
          coverArtists,
        } = appropriateWorkCreditsCall.data;

        setWorkCredits([
          { writers },
          { artists },
          { editors },
          { inkers },
          { letterers },
          { pencillers },
          { colorists },
          // eslint-disable-next-line camelcase
          { cover_Artist: coverArtists },
        ]);

        // get the genres for this book and issue and set it to the genre list state
        const getGenresRes = await getGenres(urlSlug, bookId);
        const { genres } = getGenresRes.data;
        setGenreList(genres);
      } catch (err) {
        // setErrMsg("Something went wrong! Please try again later.");
      }
    })();
  }, [bookId, isIssue, issueNumber, urlSlug]);

  //   useEffect(() => {
  //     // console.log(workCredits);
  //   }, [workCredits]);

  const accredited = () => {
    const accreditedData = filterOutEmptyWorkCreditsObj().map((workCredit) => {
      const workCreditKey = Object.keys(workCredit);
      const workCreditAsString = workCreditKey[0];
      const allWorkCreditValues = workCredit[workCreditKey];

      //   // if object key contains _ remove it, make name uppercase and then add it to the array data
      const header = `${workCreditAsString.replace("_", " ")} (${
        allWorkCreditValues.length
      })`;

      // map through current allAccreditedWorkValues and return the html containing all the work details for this specific role
      const description = allWorkCreditValues.map((worksUserParticipatedIn) => {
        return {
          id: `${workCreditAsString}-${nanoid()}`,
          listItem: `
                  <a class="desc-detail link" href="/profile/${worksUserParticipatedIn}">
                    ${worksUserParticipatedIn}
                  </a>`,
        };
      });

      return {
        id: `${workCreditAsString}-${nanoid()}`,
        header,
        description,
      };
    });

    const accreditedIssues = () => {
      // Reduce the time complexity of this. It is terrible
      return filterOutEmptyWorkCreditsObj().map((workCredit) => {
        const header = `${Object.keys(workCredit)[0].replace("_", " ")}`;
        const creators = Object.values(workCredit).map((workCreditVal) => (
          <li key={nanoid()} className="creator-list-item">
            <Link
              className="desc-detail link normal"
              to={`/profile/${workCreditVal}`}
            >
              {workCreditVal}
            </Link>
          </li>
        ));
        return (
          <div key={nanoid()} className="credit-section">
            <h3 className="tertiary-header creator-header">{header}</h3>
            <ul className="creator-list">{creators}</ul>
          </div>
        );
      });
    };
    return (
      <article className={`${className}-panel`}>
        <div className="view-whole-field">
          <h3 className="tertiary-header accredited-issue-row">Accredited:</h3>
          {isIssue ? (
            <div className="accredited-issue-info">
              {/* Shows a list of all the creators of the current issue */}
              {accreditedIssues()}
            </div>
          ) : (
            <div>
              {/* Shows all the creators who contributed to atleast all on of the issues in a book.
            Uses the accredited component */}
              <Accordion
                AccordianData={accreditedData}
                className="accredited-works-accordian detail-accordian"
              />
            </div>
          )}
        </div>
      </article>
    );
  };

  const details = () => {
    return (
      <article className={`${className}-panel`}>
        {/* Only show these fields if this is an issue */}
        {isIssue ? (
          <>
            <div className="view-half-field">
              <h3 className="tertiary-header">Total Page Count:</h3>
              <div className="desc-detail normal">{totalIssuePages}</div>
            </div>
            <div className="view-half-field">
              <h3 className="tertiary-header">Volume/Issue #:</h3>
              <div className="desc-detail normal">{issueNum}</div>
            </div>
          </>
        ) : (
          <></>
        )}
        <div className={`view-${className}-field`}>
          <h3 className="tertiary-header">Date Published:</h3>
          <div className="desc-detail normal">
            {moment(dateCreated).format("MMMM D, YYYY")}
          </div>
        </div>
        {lastUpdated ? (
          <div className={`view-${className}-field`}>
            <h3 className="tertiary-header">Last Updated:</h3>
            <div className="desc-detail normal">
              {moment(lastUpdated).format("MMMM D, YYYY")}
            </div>
          </div>
        ) : (
          <></>
        )}
      </article>
    );
  };

  const genres = () => {
    const orderClass = isIssue ? "last-order" : "";
    return (
      <article className={`whole-panel ${orderClass}`}>
        <div className="view-whole-field">
          <h3 className="tertiary-header text-center">Genres:</h3>
          <ul className="genres">
            {genreList.map((genre) => (
              <li className="genre-item" key={nanoid()}>
                {genre}
              </li>
            ))}
          </ul>
        </div>
      </article>
    );
  };

  return (
    <section className="extra-info-container mt-50">
      <section className="secondary-info">
        <h2 className="desc-detail bold text-center secondary-header">
          Extra Info
        </h2>
        <div className={`panel-container ${className}-view`}>
          {accredited()}
          {details()}
          {genres()}
        </div>
      </section>
    </section>
  );
};

export default ExtraInfo;
