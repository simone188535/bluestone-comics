export const imageWidthAndHeight = (providedFile) => {
  // take the given file (which should be an image) and return the width and height

  return new Promise((resolve) => {
    const copiedFile = new Blob([providedFile], { type: providedFile.type });
    const image = new Image();

    image.onload = function () {
      copiedFile.width = image.width;
      copiedFile.height = image.height;

      resolve({ width: copiedFile.width, height: copiedFile.height });
    };

    const url = URL.createObjectURL(copiedFile);
    image.src = url;
  });
};

export const isFileSizeTooLarge = (providedFile, restrictedFileSize) => {
  return providedFile.size > restrictedFileSize;
};
