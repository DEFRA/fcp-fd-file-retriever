import { beforeEach, describe, expect, jest, test } from '@jest/globals'

const mockSharedKeyCredential = jest.fn()
const mockDefaultAzureCredential = jest.fn()

const mockCreateIfNotExists = jest.fn()

const mockServiceClient = jest.fn(() => ({
  getContainerClient: jest.fn(() => ({
    createIfNotExists: mockCreateIfNotExists
  }))
}))

jest.unstable_mockModule('@azure/storage-blob', () => ({
  BlobServiceClient: mockServiceClient,
  StorageSharedKeyCredential: mockSharedKeyCredential
}))

jest.unstable_mockModule('@azure/identity', () => ({
  DefaultAzureCredential: mockDefaultAzureCredential
}))

describe('Clean Blob Storage Client', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('should create a BlobServiceClient', async () => {
    const { client } = await import('../../../../app/storage/blob/clean')

    expect(client).toBeDefined()
  })

  test('should create container clients', async () => {
    const { containers } = await import('../../../../app/storage/blob/clean')

    expect(containers).toBeDefined()
    expect(containers.objects).toBeDefined()
  })

  describe('credentials', () => {
    test('should use access key if provided', async () => {
      const orginalEnv = process.env

      process.env = {
        ...orginalEnv,
        USE_AZURITE: 'false',
        CLN_STORAGE_ACCESS_KEY: 'key'
      }

      const { client } = await import('../../../../app/storage/blob/clean')

      expect(client).toBeDefined()
      expect(mockSharedKeyCredential).toHaveBeenCalled()
      expect(mockDefaultAzureCredential).not.toHaveBeenCalled()

      process.env = orginalEnv
    })

    test('should use managed identity if no access key is provided', async () => {
      const orginalEnv = process.env

      process.env = {
        ...orginalEnv,
        USE_AZURITE: 'false',
        clean_STORAGE_ACCESS_KEY: ''
      }

      const { client } = await import('../../../../app/storage/blob/clean')

      expect(client).toBeDefined()
      expect(mockDefaultAzureCredential).toHaveBeenCalled()
      expect(mockSharedKeyCredential).not.toHaveBeenCalled()

      process.env = orginalEnv
    })
  })
})
