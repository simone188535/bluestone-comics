import * as Yup from "yup";
import _ from "lodash";
import {
  imageWidthAndHeight,
  isFileSizeTooLarge,
} from "../FileReaderValidations";

function imgDimensionCheck(width, height, message = null) {
  // this method works for an array of values and single values
  // inspired by : https://codesandbox.io/s/yup-custom-methods-rj9x6?file=/src/App.js:842-846
  // https://stackoverflow.com/questions/60525429/how-to-write-a-custom-schema-validation-using-yup-addmethod-for-country-name-a
  // https://stackoverflow.com/questions/63769152/how-to-get-yup-to-perform-more-than-one-custom-validation

  return this.test(
    "image-image-dimension-check",
    message,
    async function (value) {
      const { path, createError } = this;

      if (!value || value.length === 0) {
        return;
      }

      const imgDimensions = await imageWidthAndHeight(value);

      // check to see if the width and height are with-in 20 pixels of margin and error.
      if (
        !_.inRange((imgDimensions.width, width - 10, width + 10)) ||
        !_.inRange((imgDimensions.height, height - 10, height + 10))
      ) {
        // eslint-disable-next-line consistent-return
        return createError({
          path,
          message:
            message ??
            `This file must have a width of ${width}px and a height of ${height}px!`,
        });
      }
    }
  );
}

function imgSizeCheck(maxFileSize, maxFileSizeInBytes, message = null) {
  return this.test("image-size-check", message, function (value) {
    const { path, createError } = this;

    if (!value || value.length === 0) {
      return;
    }

    const isImageTooLarge = isFileSizeTooLarge(value, maxFileSize);

    if (isImageTooLarge) {
      // eslint-disable-next-line consistent-return
      return createError({
        path,
        message:
          message ??
          `This file size is too large. The max file size is ${maxFileSizeInBytes}`,
      });
    }
  });
}

const imageDimensionCheck = Yup.addMethod(
  Yup.mixed,
  "imageDimensionCheck",
  imgDimensionCheck
);

const imageSizeCheck = Yup.addMethod(Yup.mixed, "imageSizeCheck", imgSizeCheck);

export { imageDimensionCheck, imageSizeCheck };
