const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const keys = require('../config/keys.js');
const AppError = require('./appError');
// come here for more details concerning how this works: https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = keys;
// The name of the AWS bucket that you have created
const BUCKET_NAME = 'bluestone-images';

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});
// https://stackoverflow.com/questions/48015968/node-js-unique-folder-for-each-upload-with-multer-and-shortid
// Where the idea to write this function came from concerning unique Bucket Name: https://stackoverflow.com/a/61029813/6195136
exports.uploadS3 = () => {
  // use the parameter or generate random string. This prefix is used for grouping and can help with deleting a group of images
  const randomString = () => uuid.v4().replace(/-/g, '');

  return multer({
    storage: multerS3({
      s3: s3,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      bucket: `${BUCKET_NAME}`,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        /*
          bookPrefix is the reference for the folder where the book resides in AWS.
          issuePrefix is the reference for the folder where the issue resides within the book in AWS.
        */
        const { bookImagePrefixRef, issueImagePrefixRef } = req.body;
        console.log(
          'BbookImagePrefixRef: ',
          bookImagePrefixRef,
          'issueImagePrefixRef: ',
          issueImagePrefixRef
        );
        // JSON.parse(issueImagePrefixRef);

        // console.log('req.body: ', req.body);
        // if (issueImagePrefixRef) {
        //   console.log('imagePrefix', issueImagePrefixRef);
        // }
        // const optionalIssueImagePrefixRef = issueImagePrefixRef
        //   ? `/${issueImagePrefixRef}`
        //   : '';
        cb(
          null,
          `${bookImagePrefixRef}/${issueImagePrefixRef}/${randomString()}`
        );
      }
    })
  });
};

// AWS docs are here: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

// Retrieve object from Amazon s3
exports.getObject = async (params) => {
  try {
    const s3Response = await s3.getObject(params).promise();
    console.log('s3Response: ', s3Response);
    return s3Response;
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

// Returns some or all objects in a bucket
exports.listObjects = async (params) => {
  try {
    const s3Response = await s3.listObjectsV2(params).promise();
    console.log('s3Response: ', s3Response);
    return s3Response;
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

// Delete an object/single file
exports.deleteObject = async (params) => {
  try {
    const s3Response = await s3.deleteObject(params).promise();
    console.log('s3Response: ', s3Response);
    return s3Response;
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

// Delete an entire Bucket
exports.deleteBucket = async (params) => {
  try {
    const s3Response = await s3.deleteBucket(params).promise();
    console.log('s3Response: ', s3Response);
    return s3Response;
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};
