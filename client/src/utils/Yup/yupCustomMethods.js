import * as Yup from "yup";
import {
  imageWidthAndHeight,
  isFileSizeTooLarge,
} from "../FileReaderValidations";
import IMAGE_UPLOAD_DIMENSIONS from "../Constants";

export const imageDimensionCheck = Yup.addMethod(
  Yup.mixed,
  "imageDimensionCheck",
  function (message = null) {
    // this method works for an array of values and single values
    // inspired by : https://codesandbox.io/s/yup-custom-methods-rj9x6?file=/src/App.js:842-846
    // https://stackoverflow.com/questions/60525429/how-to-write-a-custom-schema-validation-using-yup-addmethod-for-country-name-a
    // https://stackoverflow.com/questions/63769152/how-to-get-yup-to-perform-more-than-one-custom-validation

    return this.test(
      "image-width-height-check",
      message,
      async function (value) {
        const { path, createError } = this;

        if (!value || value.length === 0) {
          return;
        }

        const { WIDTH, HEIGHT } = IMAGE_UPLOAD_DIMENSIONS.THUMBNAIL;
        const imgDimensions = await imageWidthAndHeight(value);

        if (imgDimensions.width !== WIDTH || imgDimensions.height !== HEIGHT) {
          // eslint-disable-next-line consistent-return
          return createError({
            path,
            message:
              message ??
              `This file must have a width of ${WIDTH}px and a height of ${HEIGHT}px!`,
          });
        }
      }
    );
  }
);

export const imageSizeCheck = Yup.addMethod(
  Yup.mixed,
  "imageSizeCheck",
  function (message = null) {
    return this.test("image-size-check", message, function (value) {
      const { path, createError } = this;

      if (!value || value.length === 0) {
        return;
      }

      const { MAX_FILE, MAX_FILE_IN_BYTES } = IMAGE_UPLOAD_DIMENSIONS.THUMBNAIL;
      const isImageTooLarge = isFileSizeTooLarge(value, MAX_FILE);

      if (isImageTooLarge) {
        // eslint-disable-next-line consistent-return
        return createError({
          path,
          message:
            message ??
            `This file size is too large. The max file size is ${MAX_FILE_IN_BYTES}`,
        });
      }
    });
  }
);
