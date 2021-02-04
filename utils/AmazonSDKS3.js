const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const keys = require('../config/keys.js');
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
exports.uploadS3 = (bookIdentifier = '', issueIdentifier = '') => {
  // use the parameter or generate random string. This prefix is used for grouping and can help with deleting a group of images
  const randomString = () => uuid.v4().replace(/-/g, '');
  const bookPrefix = bookIdentifier || randomString();
  const issuePrefix = issueIdentifier || randomString();

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
        cb(null, `${bookPrefix}/${issuePrefix}/${randomString()}`);
      }
    })
  });
};
