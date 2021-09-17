export const imageWidthAndHeight = (providedFile) => {
    // take the given file (which should be an image) and return the width and height
    const imgDimensions = { width: null, height: null };

    return new Promise(resolve => {
        const reader = new FileReader();

        reader.readAsDataURL(providedFile);
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

export const isFileSizeTooLarge = (providedFile, restrictedFileSize) => {
    return providedFile.size > restrictedFileSize;
}