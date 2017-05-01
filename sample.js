// Snippet to upload files to S34 bucket and render them public
let  AWS = require('aws-sdk');
let fs = require('fs');
let  bucketName = 'dm88-limited-bucket';
let path = require('path');
let  bucketPublicPath =  bucketName + '/public';
// This is the configuration section. To fill if the computer is not yet configured
// AWS.config.update({
//                     accessKeyId: '********************',
//                     secretAccessKey: '****************************************',
//                     region: "us-east-1"
//                   });

let s3 = new AWS.S3();
// First we create the bucket
let bucketParams = {
   Bucket : bucketName
};

s3.createBucket(bucketParams, function(err, data) {
   if (err) {
      console.log("Error", err);
   } else {
      console.log("Success", data.Location);
   }
});

// And then we upload files to it
let filePath = path.join(__dirname, '/publicfiles/');

fs.readdir(filePath, (err, files) => {
  for (let file of files) {
        let fileToUpload = path.join(filePath,file);
            fs.readFile(fileToUpload, function (err, data) {
              if (err) { throw err; }
              let base64data = new Buffer(data, 'binary');
                s3.putObject({
                  Bucket: bucketPublicPath,
                  Key: file,
                  Body: base64data,
                  ACL: 'public-read'
                },function (err) {
                  if(err) {
                    console.log(err.code);
                  }
                  else console.log('Successfully uploaded: ', file);
                });
            });
          }
});
// A file will be visible on the internet as follows:
//https://s3.amazonaws.com/dm88-limited-bucket/public/beech.jpg
