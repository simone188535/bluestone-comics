export default function onUploadProgressHelper(setUploadPercentage) {
  return {
    onUploadProgress(progressEvent) {
      // set setUploadPercentage hook with the upload percentage
      const progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );

      // stop bar from filling to 100 until promise is returned.
      if (progress > 95) {
        setUploadPercentage(95);
        return;
      }

      setUploadPercentage(progress);
    },
  };
}
