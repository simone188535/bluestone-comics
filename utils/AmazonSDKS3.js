const fs = require('fs');
const AWS = require('aws-sdk');
const keys = require('../config/keys.js');
// come here for more details concerning how this works: https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = keys;
// The name of the AWS bucket that you have created
const BUCKET_NAME = 'bluestone-images';

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});

module.exports.uploadFile = (fileName) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'cat.jpg', // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};
