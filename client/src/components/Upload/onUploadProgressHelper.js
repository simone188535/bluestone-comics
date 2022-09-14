export default function onUploadProgressHelper(setUploadPercentage) {
  return {
    onUploadProgress(progressEvent) {
      // set setUploadPercentage hook with the upload percentage
      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );

      setUploadPercentage(progress);
    },
  };
}
