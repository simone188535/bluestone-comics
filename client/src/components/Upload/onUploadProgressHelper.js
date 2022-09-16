export default function onUploadProgressHelper(
  setUploadPercentage,
  divideBy = 1
) {
  return {
    onUploadProgress(progressEvent) {
      // set setUploadPercentage hook with the upload percentage
      const progress = Math.round(
        ((progressEvent.loaded / progressEvent.total) * 100) / divideBy
      );

      setUploadPercentage(progress);
    },
  };
}
