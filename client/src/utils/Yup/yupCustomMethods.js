import { imageWidthAndHeight } from '../FileReaderValidations';
import { IMAGE_UPLOAD_DIMENSIONS } from '../Constants'
import * as Yup from 'yup';



export const imageDimensionCheck = Yup.addMethod(Yup.mixed, 'imageDimensionCheck', function (message = null) {

    // this method works for an array of values and single values
    // inspired by : https://codesandbox.io/s/yup-custom-methods-rj9x6?file=/src/App.js:842-846
    // https://stackoverflow.com/questions/60525429/how-to-write-a-custom-schema-validation-using-yup-addmethod-for-country-name-a
    // https://stackoverflow.com/questions/63769152/how-to-get-yup-to-perform-more-than-one-custom-validation

    return this.test("image-width-height-check", message, async function (value) {
        const { path, createError } = this;

        if (!value || value.length === 0) {
            return;
        }

        const requiredWidth = IMAGE_UPLOAD_DIMENSIONS.THUMBNAIL.WIDTH;
        const requiredHeight = IMAGE_UPLOAD_DIMENSIONS.THUMBNAIL.HEIGHT;
        const imgDimensions = await imageWidthAndHeight(value);

            if ((imgDimensions.width !== requiredWidth) ||  (imgDimensions.height !== requiredHeight)) {
                return createError({
                    path,
                    message: message ?? `This file must have a width of ${requiredWidth}px and a height of ${requiredHeight}px!`
                });
            }

        return true;
    });
});


