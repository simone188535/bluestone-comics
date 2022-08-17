import React from "react";
import slugify from "slugify";
import { Field, ErrorMessage, useField, useFormikContext } from "formik";

import FileInputSingleUpload from "../CommonUI/FileInputSingleUpload";
import CONSTANTS from "../../utils/Constants";

const {
  IMAGE_UPLOAD_DIMENSIONS: {
    THUMBNAIL: { WIDTH, HEIGHT },
  },
} = CONSTANTS;

const UrlSlugifedField = (props) => {
  /*
        The default value of this field is dependent on the value of the book title field. The user
        is still able to customize it though.
    */
  const {
    values: { bookTitle },
    setFieldValue,
  } = useFormikContext();
  const [field] = useField(props);

  React.useEffect(() => {
    setFieldValue(props.name, slugify(bookTitle));
    // eslint-disable-next-line react/destructuring-assignment
  }, [bookTitle, setFieldValue, props.name]);

  return (
    <>
      <input {...props} {...field} />
    </>
  );
};

const BookUpload = ({
  bookCoverPhotoPrevExistingData = {
    toBeRemovedField: null,
    hasPrevUploadedData: false,
  },
}) => {
  const { values } = useFormikContext();
  return (
    <>
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
      <FileInputSingleUpload
        identifier="bookCoverPhoto"
        triggerText="Select Book Thumbnail Photo"
        toBeRemovedField={bookCoverPhotoPrevExistingData.toBeRemovedField}
        hasPrevUploadedData={bookCoverPhotoPrevExistingData.hasPrevUploadedData}
      />
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name="bookCoverPhoto"
      />
      <div className="form-header-subtext">
        Thumbnail size must be: <strong>{`${WIDTH} x ${HEIGHT}`}</strong>
      </div>
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
      <UrlSlugifedField
        className="form-input form-item slug-field"
        name="urlSlug"
        type="text"
        placeholder="URL Slug"
        autoComplete="on"
      />
      <div className="form-header-subtext">
        <strong>Your Comic URL will be similar to this: </strong>{" "}
        https://bluestonecomics.com/api/v1/read/
        <strong>{values.urlSlug ? values.urlSlug : "<URL Slug>"}</strong>
        /book/1234
      </div>
      <ErrorMessage
        className="error-message error-text-color"
        component="div"
        name="urlSlug"
      />
    </>
  );
};
export default BookUpload;
