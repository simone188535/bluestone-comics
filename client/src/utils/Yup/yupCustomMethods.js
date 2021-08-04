
import * as Yup from "yup";

const imageWidthHeight = (provideFile) => {
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

export const imageDimensionCheck = Yup.addMethod(Yup.mixed, 'imageDimensionCheck', function (message, requiredWidth, requiredHeight) {
    return this.test("image-width-height-check", message, async function (value) {
        const { path, createError } = this;

        if (!value) {
            return;
        }

        const imgDimensions = await imageWidthHeight(value);

        console.log('! ', imgDimensions);
        if (imgDimensions.width !== requiredWidth) {
            return createError({
                path,
                message: `The file width needs to be the ${requiredWidth}px!`
              });
        }

        if (imgDimensions.height !== requiredHeight) {
            return createError({
                path,
                message: `The file height needs to be the ${requiredHeight}px!`
              });
        }

        return true;
        // return console.log('addMethod: ', value);
    });
});


