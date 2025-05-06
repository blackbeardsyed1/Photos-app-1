const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

module.exports = async (fileBuffer, originalName) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONN);
  const containerClient = blobServiceClient.getContainerClient('photo-container');
  const blobName = uuidv4() + '_' + originalName;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(fileBuffer, { overwrite: true });
  return blockBlobClient.url;
};
