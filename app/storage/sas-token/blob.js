import { BlobSASPermissions, generateBlobSASQueryParameters, SASProtocol } from '@azure/storage-blob'
import { storageConfig } from '../../config/index.js'
import { client } from '../blob/clean.js'
import sasPolicy from '../../constants/sas-policy.js'

const accountName = storageConfig.get('clean.accountName')
const containerName = storageConfig.get('container.objects')

const createServiceBlobSasToken = (containerClient, blobId, sharedKeyCredential, storedPolicyName) => {
  const sasOptions = {
    containerName: containerClient.containerName,
    blobName: blobId
  }

  const CURRENT_TIME = new Date()

  if (storedPolicyName == null) {
    sasOptions.startsOn = new Date(CURRENT_TIME.valueOf() - sasPolicy.SAS_START_INTERVAL)
    sasOptions.expiresOn = new Date(CURRENT_TIME.valueOf() + sasPolicy.SAS_TIME_LIMIT)
    sasOptions.permissions = BlobSASPermissions.parse(sasPolicy.BLOB_SAS_PERMISSIONS_INTERNAL_USER)
  } else {
    sasOptions.identifier = storedPolicyName
  }

  // Temporary log for context/to confirm SAS Options are correctly set
  console.log(`SAS Options: ${JSON.stringify({
    containerName: sasOptions.containerName,
    blobName: sasOptions.blobName,
    startsOn: sasOptions.startsOn,
    expiresOn: sasOptions.expiresOn,
    permissions: sasOptions.permissions
  }, null, 2)}`)

  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString()

  return `${containerClient.getBlobClient(blobId).url}?${sasToken}}`
}

const createUserDelegationBlobSasToken = async (blobId) => {
  const CURRENT_TIME = new Date()
  const sasStartTime = new Date(CURRENT_TIME.valueOf() - sasPolicy.SAS_START_INTERVAL)
  const sasTimeLimit = new Date(CURRENT_TIME.valueOf() + sasPolicy.SAS_TIME_LIMIT)

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

  return sasToken
}

export {
  createServiceBlobSasToken,
  createUserDelegationBlobSasToken
}
