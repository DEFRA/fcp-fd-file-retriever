import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import { MALICIOUS_FILE } from '../../../app/constants/av-results.js'

import { pdf } from '../../mocks/files'

jest.setTimeout(30000)

jest.unstable_mockModule('../../../app/repos/clean', () => ({
  getObject: jest.fn()
}))

jest.unstable_mockModule('../../../app/repos/malicious', () => ({
  quarantineObject: jest.fn()
}))

const cleanRepo = await import('../../../app/repos/clean.js')
const maliciousRepo = await import('../../../app/repos/malicious.js')

const { handleFileRetrieval } = await import('../../../app/services/retrieve.js')

describe('retrieve service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should retrieve file from clean storage', async () => {
    const path = 'clean/file/path'
    const data = pdf
    cleanRepo.getObject.mockResolvedValue(data)

    const [file, err] = await handleFileRetrieval(path)

    expect(cleanRepo.getObject).toHaveBeenCalledWith(path)
    expect(file).toEqual(data)
    expect(err).toBeNull()
  })

  test('should handle malicious file and move to quarantine', async () => {
    const path = 'malicious/file/path'
    const mockError = { cause: MALICIOUS_FILE }
    cleanRepo.getObject.mockRejectedValue(mockError)
    maliciousRepo.quarantineObject.mockResolvedValue()

    const [file, err] = await handleFileRetrieval(path)

    expect(cleanRepo.getObject).toHaveBeenCalledWith(path)
    expect(maliciousRepo.quarantineObject).toHaveBeenCalledWith(undefined, path)
    expect(file).toBeNull()
    expect(err).toEqual(mockError)
  })

  test('should handle other errors', async () => {
    const path = 'error/file/path'
    const mockError = new Error('Some error')
    cleanRepo.getObject.mockRejectedValue(mockError)

    const [file, err] = await handleFileRetrieval(path)

    expect(cleanRepo.getObject).toHaveBeenCalledWith(path)
    expect(file).toBeNull()
    expect(err).toEqual(mockError)
  })
})
