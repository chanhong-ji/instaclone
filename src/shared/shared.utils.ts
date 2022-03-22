import AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
  region: "ap-northeast-2",
});

export const uploadToS3 = async (file: any, userId: number, path: string) => {
  const { filename, createReadStream } = await file;
  const stream = createReadStream();
  const objectName = `${path}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "instacloneee",
      Key: objectName,
      ACL: "public-read",
      Body: stream,
    })
    .promise();
  return Location;
};

export const deleteFromS3 = async (fileUrl: string) => {
  const decodedUrl = decodeURI(fileUrl);
  const objectName = decodedUrl.split("/").slice(-2).join("/");
  await new AWS.S3()
    .deleteObject({
      Bucket: "instacloneee",
      Key: objectName,
    })
    .promise();
};
