import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import slugify from "slugify";
import { Field, ErrorMessage, useField, useFormikContext } from "formik";

import Checkboxes from "../CommonUI/Checkboxes";
import FileInputSingleUpload from "../CommonUI/FileInputSingleUpload";
import CONSTANTS from "../../utils/Constants";

const {
  IMAGE_UPLOAD_DIMENSIONS: {
    THUMBNAIL: { WIDTH, HEIGHT },
  },
} = CONSTANTS;

const UrlSlugifedField = ({ name, ...props }) => {
  const {
    values: { bookTitle },
    setFieldValue,
  } = useFormikContext();

  const { urlSlug } = useParams();
  const [hasBookTitleBeenEmpty, setHasBookTitleBeenEmpty] = useState(null);

  useEffect(() => {
    if (bookTitle === "") setHasBookTitleBeenEmpty(true);
  }, [bookTitle]);
  /*
        The default value of this field is dependent on the value of the book title field. The user
        is still able to customize it though.
    */
  const [field] = useField(name);

  useEffect(() => {
    // if the field has never been empty and a prevExisting urlSlug is present, show the current urlSlug
    const prevExistingUrlSlug =
      !hasBookTitleBeenEmpty && urlSlug ? urlSlug : null;

    // if a prevslug is provided, set the name to it, there is no need to slugify, else slugify the bookTitle value
    setFieldValue(name, prevExistingUrlSlug || slugify(bookTitle || ""));
  }, [bookTitle, name, urlSlug, setFieldValue, hasBookTitleBeenEmpty]);

  return <input {...props} {...field} />;
};

const ratingsRadioBtn = [
  { option: "General", value: "G" },
  { option: "Teen", value: "T" },
  { option: "Mature", value: "M" },
  // { option: "Explicit", value: "E" },
].map((rating) => (
  <label className="radio-label" key={`rating-radio-btn-${rating.value}`}>
    <Field
      type="radio"
      name="contentRating"
      className="radio-btn"
      value={rating.value}
    />
    {rating.option}
  </label>
));

const BookUpload = ({
  bookCoverPhotoData = {
    identifier: "bookCoverPhoto",
    toBeRemovedField: null,
    hasPrevUploadedData: false,
  },
}) => {
  const { values } = useFormikContext();
  return (
    <>
      <div className="form-item-container">
        <Field
          className="form-input form-item"
          name="bookTitle"
          type="text"
          placeholder="Book Title"
        />
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="bookTitle"
        />
      </div>

      <div className="form-item-container">
        <FileInputSingleUpload
          identifier={bookCoverPhotoData.identifier}
          triggerText="Select Book Thumbnail Photo"
          toBeRemovedField={bookCoverPhotoData.toBeRemovedField}
          hasPrevUploadedData={bookCoverPhotoData.hasPrevUploadedData}
        />
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="bookCoverPhoto"
        />
        <div className="form-header-subtext">
          Thumbnail size must be: <strong>{`${WIDTH}px x ${HEIGHT}px`}</strong>
        </div>
      </div>

      <div className="form-item-container">
        <Field
          className="form-input form-textarea"
          name="bookDescription"
          as="textarea"
          placeholder="Book Description"
          autoComplete="on"
        />
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="bookDescription"
        />
      </div>
      <div className="form-item-container">
        <UrlSlugifedField
          className="form-input form-item slug-field"
          name="urlSlug"
          type="text"
          placeholder="URL Slug"
          autoComplete="on"
        />
        <div className="form-header-subtext">
          <strong>Your Comic URL will be similar to this: </strong>{" "}
          https://bluestonecomics.com/read/
          <strong>{values.urlSlug ? values.urlSlug : "<URL Slug>"}</strong>
          /book/example/issue/1
        </div>
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="urlSlug"
        />
      </div>

      <div className="form-item-container">
        <div className="form-header-text form-header-text-sm-bottom">
          Select the applicable <strong>content rating</strong>:
        </div>
        <div className="radio-btn-group">{ratingsRadioBtn}</div>
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="contentRating"
        />
      </div>

      <div className="form-item-container">
        <div className="form-header-text">
          Select the applicable <strong>genres</strong>:
        </div>
        <ul className="checkbox-group upload-checkboxes">
          <Checkboxes
            identifier="genres"
            type="multiple"
            wrapperElement="li"
            checkboxValue={[
              { name: "Action", value: "action" },
              { name: "Adventure", value: "adventure" },
              { name: "Anthropomorphic", value: "anthropomorphic" },
              { name: "Children", value: "children" },
              { name: "Comedy", value: "comedy" },
              { name: "Crime", value: "crime" },
              { name: "Drama", value: "drama" },
              { name: "Family", value: "family" },
              { name: "Fantasy", value: "fantasy" },
              { name: "Graphic Novel", value: "graphic novel" },
              { name: "Historical", value: "historical" },
              { name: "Horror", value: "horror" },
              { name: "LGBTQ", value: "lgbtq" },
              { name: "Mature", value: "mature" },
              { name: "Music", value: "music" },
              { name: "Mystery", value: "mystery" },
              { name: "Mythology", value: "mythology" },
              { name: "Psychological", value: "psychological" },
              { name: "Romance", value: "romance" },
              { name: "School Life", value: "school life" },
              { name: "Sci-Fi", value: "sci-fi" },
              { name: "Slice of Life", value: "slice of life" },
              { name: "Sport", value: "sport" },
              { name: "Superhero", value: "superhero" },
              { name: "Supernatural", value: "supernatural" },
              { name: "Thriller", value: "thriller" },
              { name: "War", value: "war" },
              { name: "Western", value: "western" },
              { name: "Zombies", value: "zombies" },
            ]}
          />
        </ul>
        <ErrorMessage
          className="error-message error-text-color"
          component="div"
          name="genres"
        />
      </div>
    </>
  );
};
export default BookUpload;
