import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import MetaTags from "../../../MetaTags";
import video from "../../article-details/01/assets/video/Upload-a-new-comic-book-tutorial.mp4";
// import importAll from "../../../../utils/importAllAssets";
import "./upload-work-tutorial.scss";

// const images = importAll("../../article-details/01/assets", false, /^\.\/.*$/);

// console.log("images", images);
function UploadWorkTutorial({
  // img,
  extraDetails: { date, minRead } = { extraDetails: {} },
}) {
  return (
    <>
      <MetaTags
        title="How to Publish A Comic Book Online: Step-by-Step Guide"
        canonical="https://www.bluestonecomics.com/articles/how-to-publish-your-comic-book-online"
        description="Bluestone Comics allows you to publish your comic books online without having to compromise your vision to fit within the constraints of a traditional publisher's preferences."
      />
      <header className="article-header">
        <h1 className="article-header-title">
          How to Publish A Comic Book Online: Step-by-Step Guide
        </h1>
      </header>
      <section className="article-sub-header">
        <h2 className="article-header-sub-title">
          The &#34;How-To&#34; guide for self-publishing American Comic Books
        </h2>
      </section>
      <section className="article-creation-details">
        <span className="extra-details">
          {date && (
            <span className="extra-details-item date">
              {moment(date).format("MMM D YYYY")}
            </span>
          )}
          {minRead && (
            <span className="extra-details-item min-read">
              {minRead} min read
            </span>
          )}
        </span>
      </section>
      <section className="article-hr-spacing">
        <hr className="article-hr" />
      </section>
      <article className="article-para">
        <figure className="article-figure">
          <video muted controls className="article-video">
            <source src={video} type="video/mp4" />
          </video>

          <figcaption className="article-figure-cap">
            How to Publish A Comic Book Tutorial
          </figcaption>
        </figure>
        <p className="article-para">
          <strong className="mid-bold">Self-publishing</strong> gives you full
          creative control over your comic book. You have the freedom to create
          the story, artwork, and design exactly as you envision it.{" "}
        </p>
        <p className="article-para">
          <strong className="mid-bold">
            Bluestone Comics allows you to publish your comic books online
          </strong>{" "}
          without having to compromise your vision to fit within the constraints
          of a traditional publisher&#39;s preferences.
        </p>

        <h2 className="article-para">
          <strong className="mid-bold">
            In order to self-publish your comic book on our site…
          </strong>
        </h2>

        <article className="article-para">
          <ol className="article-list">
            <li className="bold-marker">
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
            <li className="bold-marker">
              <p className="mb-sm">
                Go to the{" "}
                <Link to="/upload" className="standard-link">
                  upload page
                </Link>{" "}
                to create a comic book and its first issue.
              </p>

              <figure className="article-figure">
                <img
                  src="https://placebear.com/640/360"
                  alt="Trulli"
                  className="article-figure-img"
                />
                <figcaption className="article-figure-cap">
                  Fig.1 - Trulli, Puglia, Italy.
                </figcaption>
              </figure>
            </li>
            <li className="bold-marker">
              <p className="mb-sm">
                Add a book title. The name chosen for the book will also serve
                as the name of the work in the URL.{" "}
              </p>
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
            <li className="bold-marker">
              <p className="mb-sm">Select a book thumbnail photo.</p>{" "}
              <p className="mb-sm">
                The book thumbnail photo is essentially the book&#39;s cover
                photo. It is the cover image for the &#34;front of the
                book&#34;.
              </p>
              <p>
                <span className="note">Note: </span>
                The thumbnail must have a width of 320 pixels and a height of
                485 pixels. The maximum file size allowed is 1 Megabyte (MB).
              </p>
            </li>
            <li className="bold-marker">Add a book description.</li>
            <li className="bold-marker">
              <p className="mb-sm">Update the URL Slug.</p>
              <p className="mb-sm">
                <span className="note">Note: </span>If you&#39;d like the URL
                Slug to be different from the book title. See step 3.
              </p>
            </li>
            <li className="bold-marker">
              <p className="mb-sm">Select the content rating for this book.</p>{" "}
              <p>
                Make sure to check the creator guidelines to see if your work
                meets the safety criteria for all users.
              </p>
            </li>
            <li className="bold-marker">
              Select the genres applicable for the book.
            </li>
          </ol>

          <p className="article-para">
            <strong className="mid-bold">
              Steps 9 - 13 are for filling out the details of the first issue.
              Think of an issue as a &#34;chapter&#34; of a book.
            </strong>
          </p>

          <ol className="article-list" start="9">
            <li className="bold-marker">
              <p className="mb-sm">
                Add an issue title. (This will have no effect on the &#34;URL
                Slug&#34;.)
              </p>
            </li>

            <li className="bold-marker">
              <p className="mb-sm">Select an issue thumbnail photo.</p>
              <p>
                <span className="note">Note: </span>The issue thumbnail is the
                cover photo for the issue. If you&#39;d like, you may reuse the
                same thumbnail as the one used in the book thumbnail section.
              </p>
            </li>

            <li className="bold-marker">
              <p className="mb-sm">Add an Issue description.</p>
              <p>
                Add a description of the current issue rather than the
                description of the entire book.
              </p>
            </li>

            <li className="bold-marker">
              <p className="mb-sm">
                Drag &#39;n&#39; Drop all the Issue pages or select the box and
                select all the necessary files.
              </p>
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
                megabytes.
              </p>
              <p>
                <span className="note">Note 3: </span>
                If the pages appear in the incorrect order, Drag &#39;n&#39;
                Drop them to their correct position.
              </p>
            </li>
            <li className="bold-marker">
              <p className="mb-sm">
                Give work credit(s) to all the users that assisted in creating
                the first issue (including yourself).
              </p>

              <p className="mb-sm">
                Notice your username is already present in this section.
              </p>

              <p className="mb-sm">
                <span className="note">Note: </span>
                <strong className="mid-bold">
                  If you are the only person who assisted in creating this work,
                </strong>{" "}
                Simply selecting the &#34;writer&#34; and &#34;artist&#34;
                checkboxes will suffice.{" "}
              </p>
              <p className="mb-sm">
                <strong className="mid-bold">Important!</strong> There is no
                reason to select all the available checkboxes, as it will
                overcomplicate the search for users trying to view which primary
                roles were fulfilled.
              </p>

              <p className="mb-sm">
                <span className="note">Note 2: </span>
                <strong className="mid-bold">
                  If other users assisted in creating this work
                </strong>
                , search and select their username. When the dropdown closes,
                their name will appear at the bottom of the credits list.
              </p>
              <p className="mb-lg">
                <strong className="mid-bold">Important!</strong> Again, there is
                no need to select all the available checkboxes as it may
                overcomplicate the search later. Just select the primary roles
                each user has fulfilled in the issues&#39; creation.
              </p>

              <p>
                <strong className="mid-bold">
                  Only the user who uploaded the comic book can change the work
                  credits in the future.
                </strong>
              </p>
            </li>
            <li className="bold-marker">
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
