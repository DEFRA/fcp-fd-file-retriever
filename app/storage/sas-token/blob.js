import { BlobSASPermissions, generateBlobSASQueryParameters, SASProtocol } from '@azure/storage-blob'
import { storageConfig } from '../../config/index.js'
import { client, containers } from '../blob/clean.js'
import sasPolicy from '../../constants/sas-policy.js'

const accountName = storageConfig.get('clean.accountName')
const containerName = storageConfig.get('container.objects')
const NOW = new Date()

const createServiceBlobSasToken = (containerClient, blobId, sharedKeyCredential, storedPolicyName) => {
  const sasOptions = {
    containerClient: containers.objects,
    blobName: blobId
  }

  if (storedPolicyName == null) {
    sasOptions.startsOn = new Date(NOW.valueOf() - sasPolicy.SAS_START_INTERVAL)
    sasOptions.expiresOn = new Date(NOW.valueOf() + sasPolicy.SAS_TIME_LIMIT)
    sasOptions.permissions = BlobSASPermissions.parse(sasPolicy.BLOB_SAS_PERMISSIONS_INTERNAL_USER)
  } else {
    sasOptions.identifier = storedPolicyName
  }

  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString()
  console.log(`Service Blob SAS Token has been generated for Blob ${blobId}`)

  return `${containerClient.getBlobClient(blobId).url}?${encodeURIComponent(sasToken)}}`
}

const createUserDelegationBlobSasToken = async (blobId) => {
  const sasStartTime = new Date(NOW.valueOf() - sasPolicy.SAS_START_INTERVAL)
  const sasTimeLimit = new Date(NOW.valueOf() + sasPolicy.SAS_TIME_LIMIT)

  const userDelegationKey = await client.getUserDelegationKey(
    sasStartTime,
    sasTimeLimit
  )

  const sasOptions = {
    blobName: blobId,
    containerName,
    permissions: BlobSASPermissions.parse(sasPolicy.BLOB_SAS_PERMISSIONS_INTERNAL_USER),
    protocol: SASProtocol.HttpsAndHttp,
    startsOn: sasStartTime,
    expiresOn: sasTimeLimit
  }

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    userDelegationKey,
    accountName
  ).toString()

  console.log(`User delegation blob SAS token: ${sasToken}`)
  return sasToken
}

export {
  createServiceBlobSasToken,
  createUserDelegationBlobSasToken
}
