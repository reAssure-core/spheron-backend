// Import required modules
const express = require("express");
const cors = require("cors");

// Create an instance of the Express application
const app = express();

// Enable CORS for all routes
app.use(cors());
const token = process.env.KEY; // Define a sample route

const SpheronClient = require("@spheron/storage");
const { ProtocolEnum } = SpheronClient;
console.log(SpheronClient, ProtocolEnum);
const client = new SpheronClient({ token });

let currentlyUploaded = 0;
const fToUpload = async () => {
  const { uploadId, bucketId, protocolLink, dynamicLinks } =
    await client.upload("./index.js", {
      protocol: ProtocolEnum.IPFS,
      name,
      onUploadInitiated: (uploadId) => {
        console.log(`Upload with id ${uploadId} started...`);
      },
      onChunkUploaded: (uploadedSize, totalSize) => {
        currentlyUploaded += uploadedSize;
        console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
      },
    });
  return { uploadId, bucketId, protocolLink, dynamicLinks };
};

app.post("/api/data", async (req, res) => {
  res.json(await fToUpload());
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
