const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const keys = require('../config/keys');
const AppError = require('./appError');
// come here for more details concerning how this works: https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME } = keys;
// The name of the AWS bucket that you have created

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
      bucket: `${AWS_S3_BUCKET_NAME}`,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        /*
          bookPrefix is the reference for the folder where the book resides in AWS.
          issuePrefix is the reference for the folder where the issue resides within the book in AWS.
        */
        const { bookImagePrefixRef, issueImagePrefixRef } = req.body;

        if (file.fieldname === 'bookCoverPhoto') {
          return cb(null, `${bookImagePrefixRef}/${randomString()}`);
        }

        if (
          file.fieldname === 'issueCoverPhoto' ||
          file.fieldname === 'issueAssets'
        ) {
          return cb(
            null,
            `${bookImagePrefixRef}/${issueImagePrefixRef}/${randomString()}`
          );
        }
      }
    })
  });
};

// AWS docs are here: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
// Retrieve object from Amazon s3
const getObject = async (bucket, key, config) => {
  Object.assign(config, { Bucket: bucket, Key: key });

  try {
    return await s3.getObject(config).promise();
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

// Returns some or all objects in a bucket
const listObjects = async (bucket, maxKeys, config) => {
  Object.assign(config, { Bucket: bucket, MaxKeys: maxKeys });

  try {
    return await s3.listObjectsV2(config).promise();
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

// Delete an object/single file
const deleteObject = async (bucket, key, config) => {
  Object.assign(config, { Bucket: bucket, Key: key });

  try {
    return await s3.deleteObject(config).promise();
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

// Delete many object/files
const deleteObjects = async (bucket, deleteItems, config) => {
  Object.assign(config, { Bucket: bucket, Delete: { Objects: deleteItems } });

  try {
    return await s3.deleteObjects(config).promise();
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

// Delete an entire Bucket
const deleteBucket = async (bucket, config) => {
  Object.assign(config, { Bucket: bucket });
  try {
    return await s3.deleteBucket(config).promise();
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

// These are the exported methods that implement AWS Object methods

exports.listS3Objects = async (fileRef, maxKey, config = {}) => {
  // THIS NEEDS TO BE TESTED
  const AWSFileLocation = fileRef.split('/').reverse();

  const folderPrefix = `${AWSFileLocation[2]}/${AWSFileLocation[1]}/`;

  Object.assign(config, { Prefix: folderPrefix });

  return await listObjects(keys.AWS_S3_BUCKET_NAME, maxKey, config);
};

exports.getSingleS3Object = async (bucketKey, config = {}) => {
  return await getObject(keys.AWS_S3_BUCKET_NAME, bucketKey, config);
};

exports.deleteSingleS3Object = async (bucketKey, config = {}) => {
  await deleteObject(keys.AWS_S3_BUCKET_NAME, bucketKey, config);
};

exports.deleteMultipleS3Objects = async (deleteItems, config = {}) => {
  await deleteObjects(keys.AWS_S3_BUCKET_NAME, deleteItems, config);
};

exports.deleteS3Bucket = async (bucket, config = {}) => {
  // THIS NEEDS TO BE TESTED
  await deleteBucket(bucket, config);
};
