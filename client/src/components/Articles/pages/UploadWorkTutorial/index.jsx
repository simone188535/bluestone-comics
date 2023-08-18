import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import MetaTags from "../../../MetaTags";
import "./upload-work-tutorial.scss";

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
          <img
            src="https://placebear.com/640/360"
            alt="Trulli"
            className="article-figure-img"
          />
          <figcaption className="article-figure-cap">
            Fig.1 - Trulli, Puglia, Italy.
          </figcaption>
        </figure>
        <p className="article-para">
          <strong className="mid-bold">Self-publishing</strong> gives you full
          creative control over your comic book. You have the freedom to create
          the story, artwork, and design exactly as you envision it.{" "}
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
              You must be <Link to="/login">logged in</Link> or{" "}
              <Link to="sign-up">create an account</Link>.
            </li>
            <li className="bold-marker">
              Go to the <Link to="/upload">upload page</Link> to create a comic
              book and its first issue.
            </li>
            <li className="bold-marker">
              <div className="inline-li">
                <strong className="mid-bold">Add a book title.</strong> The name
                chosen for the book will also serve as the name of the work in
                the URL.{" "}
              </div>
              <div className="mt-sm">
                <strong className="mid-bold">For example, </strong> If the
                chosen book title is{" "}
                <strong className="mid-bold">&#34;my first comic&#34;</strong>.
                The URL for the comic book would be similar to:{" "}
              </div>
              <div className="mt-sm">
                <strong className="mid-bold">
                  https://bluestonecomics.com/read/my-first-comic/book/example/issue/1
                </strong>
              </div>
            </li>
            <li className="bold-marker">
              <strong className="mid-bold">
                Select a book thumbnail photo.
              </strong>{" "}
              The book thumbnail photo is essentially the book&#39;s cover
              photo. It is the cover image for the “front of the book”. It{" "}
              <strong className="mid-bold">must</strong> have a{" "}
              <strong className="mid-bold">width of 320 pixels</strong> and a{" "}
              <strong className="mid-bold">height of 485 pixels</strong>. The{" "}
              <strong className="mid-bold">maximum file size</strong> allowed is{" "}
              <strong className="mid-bold">1 Megabyte (MB).</strong>
            </li>
            <li className="bold-marker">
              <strong className="mid-bold">Add a book description.</strong>
            </li>
            <li className="bold-marker">
              <strong className="mid-bold">Update the URL Slug</strong> (If
              you&#39;d like it to be different from the book title. See step
              3).
            </li>
            <li className="bold-marker">
              <strong className="mid-bold">
                Select the content rating for this book.
              </strong>{" "}
              Make sure to check the creator guidelines to see if your work
              meets the safety criteria for all users.
            </li>
            <li className="bold-marker">
              <strong className="mid-bold">Select the genres</strong> applicable
              for the book.
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
              <strong className="mid-bold">Add an issue title</strong> (This
              will have no effect on the &#34;URL Slug&#34;).
            </li>

            <li className="bold-marker">
              <strong className="mid-bold">
                Select an issue thumbnail photo.
              </strong>{" "}
              The issue thumbnail is the cover photo for the issue. if you&#39;d
              like, you may reuse the same thumbnail as the one used in the book
              thumbnail section.
            </li>

            <li className="bold-marker">
              <strong className="mid-bold">Add an Issue description.</strong>{" "}
              Add a description of the current issue rather than the description
              of the entire book.
            </li>

            <li className="bold-marker">
              <strong className="mid-bold">
                Drag &#39;n&#39; Drop all the Issue pages
              </strong>{" "}
              or select the box and select all the necessary files.{" "}
              <strong className="mid-bold">
                The recommended file width is 1988 pixels
              </strong>{" "}
              and{" "}
              <strong className="mid-bold">
                the recommended height is 3056 pixels
              </strong>{" "}
              for all the uploaded issue pages. The width and height can be
              smaller, but no larger than the recommended file dimensions. The
              file size of any given page can be{" "}
              <strong className="mid-bold">
                no larger than 2 megabytes. If the pages appear in the incorrect
                order, Drag &#39;n&#39; Drop them to their correct position.
              </strong>
            </li>

            <li className="bold-marker">
              <div className="inline-li">
                <strong className="mid-bold">
                  Give work credit(s) to all the users that assisted in creating
                  the first issue (including yourself).
                </strong>{" "}
                Notice your username is already present in this section.
              </div>
              <div className="mt-sm">
                <strong className="mid-bold">
                  If you are the only person who assisted in creating this work,
                </strong>{" "}
                Simply selecting the{" "}
                <strong className="mid-bold">&#34;writer&#34;</strong> and{" "}
                <strong className="mid-bold">&#34;artist&#34;</strong>{" "}
                checkboxes will suffice. There is no reason to select all the
                available checkboxes, as it will overcomplicate the search for
                users trying to view{" "}
                <strong className="mid-bold">
                  which primary roles were fulfilled.
                </strong>
              </div>
              <div className="mt-sm">
                <strong className="mid-bold">
                  If other users assisted in creating this work
                </strong>
                , search and select their username. When the dropdown closes,
                their name will appear at the bottom of the credits list.{" "}
                <strong className="mid-bold">
                  Again, there is no need to select all the available checkboxes
                  as it may overcomplicate the search later. Just select the
                  primary roles each user has fulfilled in the issues&#39;
                  creation.
                </strong>
              </div>
              <div className="mt-sm">
                <strong className="mid-bold">Important!</strong> Only the user
                who uploaded the comic book can change the work credits in the
                future.
              </div>
            </li>
            <li className="bold-marker">
              <strong className="mid-bold">Press the submit button.</strong>{" "}
              This process might take a while, especially if the files you
              provided were large. Try to be patient and avoid the temptation to
              refresh. When the upload is complete, the page will redirect to
              the details page of the newly published comic book.
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
