import React from "react";
import { Link } from "react-router-dom";
import MetaTags from "../../../MetaTags";
import {
  addNewIssueVideo,
  oneProfilePageDD,
  fourDetailsPage,
  sixAddIssueTitle,
  nineDragNDropPages,
  tenWorkNoUser,
  elevenWorkCredCurrUser,
  twelveWorkCredOtherUser,
  fourteenIssueThumbnail,
} from "../../article-details/01/assets/UploadNewIssueTutorial";
import ArticleHeader from "../../ArticlePage/ArticleHeader";
import "./upload-new-issue-tutorial.scss";

function UploadNewIssueTutorial({
  // img,
  extraDetails,
}) {
  return (
    <>
      <ArticleHeader
        metaData={
          <MetaTags
            title="How to Add A New Issue To My Comic Book: Step-by-Step Guide"
            canonical="https://www.bluestonecomics.com/articles/how-to-add-a-new-issue-to-my-comic-book"
            description="Bluestone Comics allows you to publish your comic books online without having to compromise your artistic vision."
          />
        }
        headerText="How to Add A New Issue To My Comic Book: Step-by-Step Guide"
        subheaderText="The &#34;How-To&#34; guide for publishing a new issue to your pre-existing Comic Books"
        extraDetails={extraDetails}
      />
      <article className="article-para">
        <figure className="article-figure">
          <video muted controls className="article-video">
            <source src={addNewIssueVideo} type="video/mp4" />
          </video>

          <figcaption className="article-figure-cap">
            How to Add a New Issue to Your Comic Book - Tutorial
          </figcaption>
        </figure>
        <p className="article-para">
          Welcome Back! Now that you&#39;ve successfully created your comic
          book, It&#39;s time to{" "}
          <strong className="normal-bold">learn how to add a new issue!</strong>
        </p>
        <p className="article-para">
          If you haven&#39;t created your first comic book for others to read,
          Check out this{" "}
          <Link
            to="/articles/how-to-publish-your-comic-book-online"
            className="standard-link"
          >
            tutorial!
          </Link>
        </p>

        <h2 className="article-para">
          <strong className="normal-bold">
            In order to publish a new issue…
          </strong>
        </h2>

        <article className="article-para">
          <ol className="article-list">
            <li>
              You must be{" "}
              <Link to="/login" className="standard-link">
                logged in
              </Link>{" "}
              to the same account that uploaded the first issue of the comic
              book.
            </li>
            <li>
              <p className="mb-md">
                Select the <strong className="normal-bold">profile page</strong>{" "}
                in the navigation menu.
              </p>
              <figure className="article-figure">
                <img
                  src={oneProfilePageDD}
                  alt="profile page dropdown"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
            </li>
            <li>
              On the profile page, under the{" "}
              <strong className="normal-bold">books</strong> section, select the
              existing work you&#39;d like to add another issue to. This will
              take you to the comic details page.
            </li>
            <li>
              <p className="mb-md">
                On the details page, select the &#34;Add Issue&#34; button.
              </p>{" "}
              <figure className="article-figure mb-md">
                <img
                  src={fourDetailsPage}
                  alt="comic details page with add issue button"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
            </li>
            <li>
              <p className="mb-md">
                On the issue upload page, Add an issue title.
              </p>{" "}
              <figure className="article-figure mb-md">
                <img
                  src={sixAddIssueTitle}
                  alt="issue upload page with title"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
            </li>

            <li>
              <p className="mb-sm">Select an issue thumbnail photo.</p>
              <figure className="article-figure mb-md">
                <img
                  src={fourteenIssueThumbnail}
                  alt="issue upload page with issue thumbnail added"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
              <p className="mb-sm">
                The issue thumbnail is the cover photo for the issue. If
                you&#39;d like, you may reuse the same thumbnail as the one used
                in the book thumbnail section.
              </p>
              <p>
                <span className="note">Note: </span>
                The thumbnail must have a width of 320 pixels and a height of
                485 pixels. The maximum file size allowed is 1 Megabyte (MB).
              </p>
            </li>

            <li>
              <p className="mb-sm">Add an Issue description.</p>
              <p className="mb-sm">
                <span className="note">Note: </span>If you&#39;d like the URL
                Slug to be different from the book title. See step 3.
              </p>
            </li>

            <li>
              <p className="mb-md">
                Drag &#39;n&#39; Drop all the necessary Issue pages.
              </p>
              <figure className="article-figure mb-md">
                <img
                  src={nineDragNDropPages}
                  alt="issue upload page with issue pages added"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
              <p className="mb-sm">
                <span className="note">Note: </span>
                The recommended file width is 1988 pixels and the recommended
                height is 3056 pixels for all the uploaded issue pages. The
                width and height can be smaller, but no larger than the
                recommended file dimensions.
              </p>
              <p className="mb-sm">
                <span className="note">Note 2: </span>
                The file size of any given page can be no larger than 2
                megabytes (MB).
              </p>
              <p>
                <span className="note">Note 3: </span>
                If the pages appear in the incorrect order, Drag &#39;n&#39;
                Drop them to their correct position.
              </p>
            </li>
            <li>
              <p className="mb-sm">
                Give work credit(s) to all the users that assisted in creating
                the first issue (including yourself).
              </p>

              <p className="mb-md">
                Notice your username is already present in this section.
              </p>
              <figure className="article-figure mb-md">
                <img
                  src={tenWorkNoUser}
                  alt="upload page work credits"
                  className="article-figure-img mb-lg"
                  width="100%"
                  height="auto"
                />
              </figure>

              <p className="mb-md">
                <span className="note">Note: </span>
                <strong className="normal-bold">
                  If you are the only person who assisted in creating this work,
                </strong>{" "}
                Simply selecting the &#34;writer&#34; and &#34;artist&#34;
                checkboxes will suffice.{" "}
              </p>
              <figure className="article-figure mb-md">
                <img
                  src={elevenWorkCredCurrUser}
                  alt="issue upload page work credits with current user"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
              <p className="mb-lg">
                <strong className="normal-bold">Important!</strong> There is no
                reason to select all the available checkboxes, as it will
                overcomplicate the search for users trying to view which primary
                roles were fulfilled.
              </p>
              <p className="mb-md">
                <span className="note">Note 2: </span>
                <strong className="normal-bold">
                  If other users assisted in creating this work
                </strong>
                , search and select their username. When the dropdown closes,
                their name will appear at the bottom of the credits list.
              </p>
              <figure className="article-figure mb-md">
                <img
                  src={twelveWorkCredOtherUser}
                  alt="upload page work credits with other users"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
              <p className="mb-lg">
                <strong className="normal-bold">Important!</strong> Again, there
                is no need to select all the available checkboxes as it may
                overcomplicate the search later. Just select the primary roles
                each user has fulfilled in the issues&#39; creation.
              </p>

              <p>
                <strong className="normal-bold">
                  Only the user who uploaded the comic book can change the work
                  credits in the future.
                </strong>
              </p>
            </li>
            <li>
              <p className="mb-sm">Press the submit button.</p>
              <p className="mb-sm">
                This process might take a while, especially if the files you
                provided were large. Try to be patient and avoid the temptation
                to refresh.
              </p>
            </li>
          </ol>
        </article>
        <p className="article-para">
          Congratulations! You&#39;ve added a new issue to your self-published
          comic book!
        </p>
      </article>
    </>
  );
}

// add meta data, mobile styling, figure tag
export default UploadNewIssueTutorial;
