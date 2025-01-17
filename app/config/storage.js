import convict from 'convict'

import isProd from '../utils/is-prod.js'

const storage = convict({
  endpoint: {
    blob: {
      doc: 'Azure Blob Storage Endpoint',
      format: String,
      default: process.env.USE_AZURITE === 'true'
        ? `${process.env.AZURITE_HOST}:${process.env.AZURITE_BLOB_PORT}/?`
        : 'https://?.blob.core.windows.net'
    }
  },
  managedIdentityClientId: {
    doc: 'Managed Identity Client ID',
    format: String,
    nullable: !isProd(),
    default: null,
    env: 'AZURE_CLIENT_ID'
  },
  clean: {
    accountName: {
      doc: 'Clean Azure Storage Account Name',
      format: String,
      default: null,
      env: 'CLN_STORAGE_ACCOUNT_NAME'
    },
    accessKey: {
      doc: 'Clean Azure Storage Account Access Key - Should only be used in local development',
      format: String,
      nullable: true,
      default: null,
      env: process.env.USE_AZURITE === 'true'
        ? 'AZURITE_ACCESS_KEY'
        : 'CLN_STORAGE_ACCESS_KEY'
    }
  },
  container: {
    objects: {
      doc: 'Azure Blob Storage Object Container',
      format: String,
      default: 'objects',
      env: 'OBJECTS_CONTAINER_NAME'
    }
  },
  emulator: {
    useEmulator: {
      doc: 'Use Azure Storage Emulator',
      format: Boolean,
      default: false,
      env: 'USE_AZURITE'
    },
    host: {
      doc: 'Azurite host',
      format: String,
      nullable: process.env.USE_AZURITE !== 'true',
      default: null,
      env: 'AZURITE_HOST'
    },
    accessKey: {
      doc: 'Azurite access key',
      format: String,
      nullable: process.env.USE_AZURITE !== 'true',
      default: null,
      env: 'AZURITE_ACCESS_KEY'
    },
    blobPort: {
      doc: 'Azurite blob port',
      format: Number,
      nullable: process.env.USE_AZURITE !== 'true',
      default: null,
      env: 'AZURITE_BLOB_PORT'
    }
  },
  allowTextFiles: {
    doc: 'Allow text files in development - Intended for testing Azure Blob Storage malware scanning',
    format: Boolean,
    default: false,
    env: 'ALLOW_TEXT_FILES'
  }
})

storage.validate({ allowed: 'strict' })

export default storage
