import React, { useEffect, useState } from "react";
import moment from "moment";
import { nanoid } from "nanoid";
import { useParams, Link } from "react-router-dom";
import {
  getBook,
  getIssue,
  getBookWorkCredits,
  getIssueWorkCredits,
  getGenres,
} from "../../services";
import Accordion from "../CommonUI/Accordion";
import "./details.scss";

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

  useEffect(() => {
    // console.log(workCredits);
  }, [workCredits]);

  const detailsFirstSection = () => {
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

  const detailsSecondSection = () => {
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
        {/* <section className="details"> */}
        <h2 className="desc-detail bold text-center secondary-header">
          Extra Info
        </h2>
        <div className={`panel-container ${className}-view`}>
          {detailsFirstSection()}
          {detailsSecondSection()}
          {genres()}
        </div>
      </section>
      {/* </section> */}
    </section>
  );
};

const Details = () => {
  const { urlSlug, bookId, issueNumber } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [detailInfo, setDetailInfo] = useState({});

  // If issueId does not exist then the provided URL and the data on this page is for a book.
  const isIssue = !!issueNumber;

  useEffect(() => {
    (async () => {
      try {
        // create call for getBook or getIssue and set it to state.
        const appropriateAPICall = isIssue
          ? await getIssue(urlSlug, bookId, issueNumber)
          : await getBook(urlSlug, bookId);

        const { book, issue, totalIssueAssets } = appropriateAPICall.data;
        // ADD AUTHOR, Genres, work credits, bookmark button
        // console.log(book);
        // console.log(issue);
        setDetailInfo({
          author: book?.username || issue?.username,
          publisherId: book?.publisher_id || issue?.publisher_id,
          bookTitle: book?.book_title || issue?.book_title,
          issueTitle: issue?.issue_title || null,
          coverPhoto: book?.cover_photo || issue?.cover_photo,
          description: book?.description || issue?.description,
          imagePrefixReference:
            book?.image_prefix_reference || issue?.image_prefix_reference,
          dateCreated: book?.date_created || issue?.date_created,
          lastUpdated: book?.last_updated || issue?.last_updated || null,
          removed: book?.removed || null,
          status: book?.status || issue?.status,
          URLSlug: book?.url_slug || null,
          issueBookId: issue?.book_id || null,
          issueNum: issue?.issue_number || null,
          totalIssuePages: totalIssueAssets || null,
        });
      } catch (err) {
        setErrMsg("Something went wrong! Please try again later.");
      }
    })();
  }, [bookId, isIssue, issueNumber, urlSlug]);

  // useEffect(() => {
  //   console.log(detailInfo);
  // }, [detailInfo]);

  const displayPrimaryInfo = (classes) => {
    return (
      <section className={`detail-description desc-detail normal ${classes}`}>
        {/* Use flex basis of 70%, flex-grow 1 and flex-shrink 1 */}
        <section className="extra-info-content-block">
          <div className="extra-info">
            <h1 className="primary-header">
              {isIssue ? detailInfo.issueTitle : detailInfo.bookTitle}
            </h1>
            <div className="desc-detail bold">
              Author:{" "}
              <Link
                to={`/profile/${detailInfo.author}`}
                className="desc-detail link"
              >
                <span className="desc-detail normal">{detailInfo.author}</span>
              </Link>
            </div>
            {isIssue && (
              <div className="desc-detail bold">
                Book:{" "}
                <span className="desc-detail normal">
                  {detailInfo.bookTitle}
                </span>
              </div>
            )}
            <div className="desc-detail bold">
              Status:{" "}
              <span className="desc-detail normal">{detailInfo.status}</span>
            </div>
            <p>
              <span className="desc-detail bold">Description:</span>{" "}
              {detailInfo.description}
            </p>
          </div>
        </section>
      </section>
    );
  };

  return (
    <div className="container-fluid details-page">
      <div
        className="bg-overlay"
        style={{ backgroundImage: `url(${detailInfo.coverPhoto})` }}
      >
        <div className="blur">
          <article className="primary-info">
            <section className="detail-img-container">
              {/* Use flex basis of 30%, flex-grow 1 and flex-shrink 1 */}
              {/* https://developer.mozilla.org/en-US/docs/Web/CSS/flex */}
              <img
                className="detail-img"
                src={detailInfo.coverPhoto}
                alt={detailInfo.title}
              />
              {/* maybe put rating stars here later */}
            </section>
            {displayPrimaryInfo("hide-until-lg")}
          </article>
        </div>
      </div>
      {displayPrimaryInfo("show-at-lg")}
      <ExtraInfo
        isIssue={isIssue}
        dateCreated={detailInfo.dateCreated}
        lastUpdated={detailInfo.lastUpdated}
        issueNum={detailInfo.issueNum}
        totalIssuePages={detailInfo.totalIssuePages}
      />
      {/* Add comment section in the future */}
    </div>
  );
};
export default Details;
