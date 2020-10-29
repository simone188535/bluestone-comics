const multer = require('multer');
const multerS3 = require('multer-s3');
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

exports.uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${BUCKET_NAME}/testing`,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    }
  })
});
