import { BlobSASPermissions, generateBlobSASQueryParameters, SASProtocol } from '@azure/storage-blob'
import { storageConfig } from '../../config/index.js'
import { client } from '../blob/clean.js'
import sasTimeConstraints from '../../constants/sas-time-constraints.js'

const createBlobSasToken = async (blobPath) => {
  const accountName = storageConfig.get('clean.accountName')
  const containerName = storageConfig.get('container.objects')

  const NOW = new Date()
  const sasStartTime = new Date(NOW.valueOf() - sasTimeConstraints.SAS_START_INTERVAL)
  const sasTimeLimit = new Date(NOW.valueOf() + sasTimeConstraints.SAS_TIME_LIMIT)

  const userDelegationKey = await client.getUserDelegationKey(
    sasStartTime,
    sasTimeLimit
  )

  const blobSasPermissionsForInternalUser = 'r'

  const sasOptions = {
    blobPath,
    containerName,
    permissions: BlobSASPermissions.parse(blobSasPermissionsForInternalUser),
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

export { createBlobSasToken }
