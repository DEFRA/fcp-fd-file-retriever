import { BlobSASPermissions, generateBlobSASQueryParameters, SASProtocol } from '@azure/storage-blob'
import { storageConfig } from '../../config/index.js'
import { client } from '../blob/clean.js'
import sasPolicy from '../../constants/sas-policy.js'

const createBlobSasToken = async (blobId) => {
  const accountName = storageConfig.get('clean.accountName')
  const containerName = storageConfig.get('container.objects')

  const NOW = new Date()
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

export { createBlobSasToken }
