import React from "react";
import { Link } from "react-router-dom";
import MetaTags from "../../../MetaTags";
import {
  uploadComicBookVideo,
  uploadPage,
  bookTitleSlug,
  bookThumbnailUploaded,
  contentRatingsGenres,
  issueAssetsAdded,
  workCreditsNoUsers,
  workCreditsCurrentUser,
  workCreditsDifferentUser,
} from "../../article-details/01/assets/UploadWorkTutorial";
import ArticleHeader from "../../ArticlePage/ArticleHeader";
import "./upload-work-tutorial.scss";

function UploadWorkTutorial({
  // img,
  extraDetails,
}) {
  return (
    <>
      <ArticleHeader
        metaData={
          <MetaTags
            title="How to Publish A Comic Book Online: Step-by-Step Guide"
            canonical="https://www.bluestonecomics.com/articles/how-to-publish-your-comic-book-online"
            description="Bluestone Comics allows you to publish your comic books online without having to compromise your artistic vision."
          />
        }
        headerText="How to Publish A Comic Book Online: Step-by-Step Guide"
        subheaderText="The &#34;How-To&#34; guide for self-publishing American Comic Books"
        extraDetails={extraDetails}
      />
      <article className="article-para">
        <figure className="article-figure">
          <video muted controls className="article-video">
            <source src={uploadComicBookVideo} type="video/mp4" />
          </video>

          <figcaption className="article-figure-cap">
            How to Publish A Comic Book Tutorial
          </figcaption>
        </figure>
        <p className="article-para">
          <strong className="normal-bold">Self-publishing</strong> gives you
          full creative control over your comic book. You have the freedom to
          create the story, artwork, and design exactly as you envision it.{" "}
        </p>
        <p className="article-para">
          <strong className="normal-bold">
            Bluestone Comics allows you to publish your comic books online
          </strong>{" "}
          without having to compromise your vision to fit within the constraints
          of a traditional publisher&#39;s preferences.
        </p>

        <h2 className="article-para">
          <strong className="normal-bold">
            In order to self-publish your comic book on our site…
          </strong>
        </h2>

        <article className="article-para">
          <ol className="article-list">
            <li>
              You must be{" "}
              <Link to="/login" className="standard-link">
                logged in
              </Link>{" "}
              or{" "}
              <Link to="sign-up" className="standard-link">
                create an account
              </Link>
              .
            </li>
            <li>
              <p className="mb-md">
                Go to the{" "}
                <Link to="/upload" className="standard-link">
                  upload page
                </Link>{" "}
                to create a comic book and its first issue.
              </p>
              <figure className="article-figure">
                <img
                  src={uploadPage}
                  alt="upload page"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
            </li>
            <li>
              <p className="mb-md">
                Add a book title. The name chosen for the book will also serve
                as the name of the work in the URL.{" "}
              </p>
              <figure className="article-figure mb-md">
                <img
                  src={bookTitleSlug}
                  alt="upload page with book title and URL slug"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
              <p className="mb-sm">
                For example, If the chosen book title is &#34;my first
                comic&#34;. The URL for the comic book would be similar to:{" "}
              </p>
              <p>
                <strong className="example-link">
                  https://bluestonecomics.com/read/my-first-comic/book/example/issue/1
                </strong>
              </p>
            </li>
            <li>
              <p className="mb-md">Select a book thumbnail photo.</p>{" "}
              <figure className="article-figure mb-md">
                <img
                  src={bookThumbnailUploaded}
                  alt="upload page with book thumbnail"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
              <p className="mb-sm">
                The book thumbnail photo is essentially the book&#39;s cover
                photo. It is the cover image for the &#34;front of the
                book&#34;.
              </p>
              <p>
                <span className="note">Note: </span>
                The thumbnail must have a width of 320 pixels and a height of
                492 pixels. The maximum file size allowed is 1 Megabyte (MB).
              </p>
            </li>
            <li>Add a book description.</li>
            <li>
              <p className="mb-sm">Update the URL Slug.</p>
              <p className="mb-sm">
                <span className="note">Note: </span>If you&#39;d like the URL
                Slug to be different from the book title. See step 3.
              </p>
            </li>
            <li>
              <p className="mb-sm">Select the content rating for this book.</p>{" "}
              <p>
                Make sure to check the creator guidelines to see if your work
                meets the safety criteria for all users.
              </p>
            </li>
            <li>
              <p className="mb-md">
                Select the genres applicable for the book.
              </p>
              <figure className="article-figure">
                <img
                  src={contentRatingsGenres}
                  alt="upload page with genres and content rating"
                  className="article-figure-img"
                  width="100%"
                  height="auto"
                />
              </figure>
            </li>
          </ol>

          <p className="article-para">
            <strong className="normal-bold">
              Steps 9 - 13 are for filling out the details of the first issue.
              Think of an issue as a &#34;chapter&#34; of a book.
            </strong>
          </p>

          <ol className="article-list" start="9">
            <li>
              <p className="mb-sm">
                Add an issue title. (This will have no effect on the &#34;URL
                Slug&#34;.)
              </p>
            </li>

            <li>
              <p className="mb-sm">Select an issue thumbnail photo.</p>
              <p className="mb-sm">
                The issue thumbnail is the cover photo for the issue. If
                you&#39;d like, you may reuse the same thumbnail as the one used
                in the book thumbnail section.
              </p>
              <p>
                <span className="note">Note: </span>
                The thumbnail must have a width of 320 pixels and a height of
                492 pixels. The maximum file size allowed is 1 Megabyte (MB).
              </p>
            </li>

            <li>
              <p className="mb-sm">Add an Issue description.</p>
              <p>
                Add a description of the current issue rather than the
                description of the entire book.
              </p>
            </li>

            <li>
              <p className="mb-md">
                Drag &#39;n&#39; Drop all the necessary Issue pages.
              </p>
              <figure className="article-figure mb-md">
                <img
                  src={issueAssetsAdded}
                  alt="upload page with issue pages added"
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
                  src={workCreditsNoUsers}
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
                  src={workCreditsCurrentUser}
                  alt="upload page work credits with current user"
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
                  src={workCreditsDifferentUser}
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
              <p>
                When the upload is complete, the page will redirect to the
                details page of the newly published comic book.
              </p>
            </li>
          </ol>
        </article>
        <p className="article-para">
          Congratulations! You&#39;ve self-published your first comic book on
          our site!
        </p>
      </article>
    </>
  );
}

// add meta data, mobile styling, figure tag
export default UploadWorkTutorial;
