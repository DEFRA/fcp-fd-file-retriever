import { BlobServiceClient } from '@azure/storage-blob'

import { storage } from '../../config/index.js'
import { getStorageEndpoint, getStorageCredential } from '../../utils/storage.js'

const endpoint = getStorageEndpoint(
  storage.get('endpoint.blob'),
  storage.get('clean.accountName')
)

const credential = getStorageCredential(
  storage.get('clean.accountName'),
  storage.get('clean.accessKey')
)

const client = new BlobServiceClient(
  endpoint,
  credential
)

const containers = {
  objects: client.getContainerClient(storage.get('container.objects'))
}

export {
  client,
  containers
}
