
import * as Yup from "yup";

const imageWidthAndHeight = (provideFile) => {
    // take the given file (which should be an image) and return the width and height
    const imgDimensions = { width: null, height: null };

    return new Promise(resolve => {
        const reader = new FileReader();

        reader.readAsDataURL(provideFile);
        reader.onload = function () {
            const img = new Image();
            img.src = reader.result;

            img.onload = function () {
                imgDimensions.width = img.width;
                imgDimensions.height = img.height;

                resolve(imgDimensions);
            }
        };
    });
}

export const imageDimensionCheck = Yup.addMethod(Yup.mixed, 'imageDimensionCheck', function (message = null, requiredWidth = 19, requiredHeight = 3) {
    // 1988, 3056
    // this method works for an array of values and single values
    // inspired by : https://codesandbox.io/s/yup-custom-methods-rj9x6?file=/src/App.js:842-846
    // https://stackoverflow.com/questions/60525429/how-to-write-a-custom-schema-validation-using-yup-addmethod-for-country-name-a
    // https://stackoverflow.com/questions/63769152/how-to-get-yup-to-perform-more-than-one-custom-validation
    // BUG Make this work with array for issue assets
    // ADD try Catch
    return this.test("image-width-height-check", message, async function (value) {
        const { path, createError } = this;

        if (!value || value.length === 0) {
            return;
        }

        const imgDimensions = await imageWidthAndHeight(value);

            if (imgDimensions.width !== requiredWidth) {
                return createError({
                    path,
                    message: message ?? `The file width needs to be the ${requiredWidth} px!`
                });
            }

            if (imgDimensions.height !== requiredHeight) {
                return createError({
                    path,
                    message: message ?? `The file height needs to be the ${requiredHeight} px!`
                });
            }

        return true;
    });
});


