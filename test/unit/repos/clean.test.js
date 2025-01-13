import { beforeEach, describe, expect, jest, test } from '@jest/globals'

const mockBlobClient = {
  downloadToBuffer: jest.fn()
}

jest.unstable_mockModule('../../../app/storage/blob/clean.js', () => ({
  containers: {
    objects: {
      getBlockBlobClient: jest.fn(() => mockBlobClient)
    }
  }
}))

const cleanRepo = await import('../../../app/repos/clean.js')

describe('clean repository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('get object should return the object', async () => {
    const path = 'objects/path'
    const buffer = Buffer.from('file content')

    mockBlobClient.downloadToBuffer.mockResolvedValue(buffer)

    const result = await cleanRepo.getObject(path)

    expect(result).toBe(buffer)
  })

  test('get object should throw an error if file not found', async () => {
    const path = 'objects/path'

    const mockError = new Error('File not found')
    mockError.statusCode = 404

    mockBlobClient.downloadToBuffer.mockRejectedValue(mockError)

    await expect(cleanRepo.getObject(path)).rejects.toThrow('Requested file not found')
    await expect(cleanRepo.getObject(path)).rejects.toMatchObject({ cause: 'FILE_NOT_FOUND' })
  })

  test('get object should throw the original error for other errors', async () => {
    const path = 'objects/path'

    const mockError = new Error('Some other error')
    mockError.statusCode = 500

    mockBlobClient.downloadToBuffer.mockRejectedValue(mockError)

    await expect(cleanRepo.getObject(path)).rejects.toThrow('Some other error')
  })
})
