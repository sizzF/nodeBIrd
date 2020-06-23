const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3({ region: 'us-east-2' });

exports.handler