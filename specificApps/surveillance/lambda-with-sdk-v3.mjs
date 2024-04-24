import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client({ region: "ap-south-1" });

export const handler = async (event) => {
  const imageData = JSON.parse(event.body).image;
  console.log("imageData",imageData);
  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');

  const timestamp = Date.now().toString();
  const fileName = `image_${timestamp}.jpeg`;
  let freq = 10;

  const params = {
    Bucket: 'my-bucket-for-xray',
    Key: fileName,
    Body: Buffer.from(base64Data, 'base64'),
    ContentType: 'image/jpeg' 
  };
  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log('Image uploaded successfully:', fileName);
    return { statusCode: 200, body: '{"status":"Image uploaded successfully","freq":'+freq+'}' };
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    return { statusCode: 500, body: '{"status":"Error uploading image"}' };
  }
};

