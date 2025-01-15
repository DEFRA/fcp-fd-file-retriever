import { StorageSharedKeyCredential } from '@azure/storage-blob'
import { ManagedIdentityCredential } from '@azure/identity'

import { storageConfig } from '../config/index.js'

const getStorageEndpoint = (endpoint, accountName) => {
  return endpoint.replace('?', accountName)
}

const getStorageCredential = (accountName, accessKey) => {
  if (accessKey) {
    console.log('Using Azure Storage Shared Key Credential for account:', accountName)

    return new StorageSharedKeyCredential(
      accountName,
      accessKey
    )
  }

  console.log('Using Azure Identity Credential for account:', accountName)

  return new ManagedIdentityCredential({ clientId: storageConfig.get('managedIdentityClientId') })
}

export {
  getStorageEndpoint,
  getStorageCredential
}
