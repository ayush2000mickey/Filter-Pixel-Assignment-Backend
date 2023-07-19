const {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
// Set the AWS Region.
const REGION = "ap-south-1";
// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: REGION,
  signer: {
    sign: async (request) => request,
  },
});

const readList = async (req, res) => {
  const bucketParams = {
    Bucket: "testbucketfp",
  };
  let imageList = [];
  try {
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));
    console.log("Success", data);

    data.Contents.forEach(function (arrayItem) {
      imageList.push(`https://testbucketfp.s3.amazonaws.com/${arrayItem.Key}`);
    });
    res.status(200).json(imageList); // For unit tests.
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { readList };
