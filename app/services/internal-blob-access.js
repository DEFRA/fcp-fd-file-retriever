import { BlobClient } from '@azure/storage-blob'
import { storageConfig } from '../config/index.js'
import { createBlobSasToken } from '../storage/sas-token/blob.js'

const internalBlobAccess = async (blobPath) => {
  const accountName = storageConfig.get('clean.accountName')
  const containerName = storageConfig.get('container.objects')

  const sasToken = await createBlobSasToken(blobPath)

  const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobPath}?${sasToken}`
  console.log('Generated SAS URL:', sasUrl)

  const blobClient = new BlobClient(sasUrl)
  const downloadResponse = await blobClient.download()
  const downloadedBuffer = await streamToBuffer(downloadResponse.readableStreamBody)

  return downloadedBuffer
}

const streamToBuffer = async (readableStream) => {
  const chunks = []
  for await (const chunk of readableStream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

export { internalBlobAccess }
