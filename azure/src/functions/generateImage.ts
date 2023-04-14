import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from "@azure/functions";
import openai from "../../util/openai";
import axios from "axios";
import generateSASToken from "../../util/generateSASToken";
import { BlobServiceClient } from "@azure/storage-blob";

const accountName = process.env.ACCOUNT_NAME;
const containerName = "images";

export async function generateImage(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const { prompt } = (await request.json()) as { prompt: string };
  let image_url = undefined;
  console.log("Prompt: ", prompt);
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    image_url = response.data.data[0].url;
  } catch (error) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.message);
  }
  console.log("CREATE IMAGE FINISHED");
  // const image_url = response.data.data[0].url | "";
  console.log("image_url: ", image_url);
  //  Donwload the image and return it as an arraybuffer
  const res = await axios.get(image_url, { responseType: "arraybuffer" });
  const arrayBuffer = res.data;

  const sasToken = await generateSASToken();

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net?${sasToken}`
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  const timestamp = Date.now();
  const file_name = `${prompt}_${timestamp}.png`;

  const blockBlobClient = containerClient.getBlockBlobClient(file_name);

  try {
    await blockBlobClient.uploadData(arrayBuffer);
    console.log("File uploaded successfully");
  } catch (error) {
    console.log("Error uploading file: ", error.message);
  }

  return { body: "Success", status: 200 };
}

app.http("generateImage", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: generateImage,
});
