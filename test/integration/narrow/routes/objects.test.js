import { beforeAll, describe, expect, jest, test } from '@jest/globals'

import * as dmzStorage from '../../../../app/storage/blob/dmz.js'
import * as cleanStorage from '../../../../app/storage/blob/clean.js'

import { pdf } from '../../../mocks/files.js'

const { containers: dmzContainers } = dmzStorage
const { containers: cleanContainers } = cleanStorage

const mockCleanBlob = jest.fn(async (path) => {
  const client = cleanContainers.objects.getBlockBlobClient(path)
  const buffer = pdf

  await client.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: 'application/pdf' }
  })

  return {
    properties: {
      contentType: 'application/pdf'
    },
    buffer
  }
})

jest.unstable_mockModule('../../../../app/storage/blob/clean.js', () => ({
  ...cleanStorage
}))

const { createServer } = await import('../../../../app/server.js')

jest.setTimeout(30000)

describe('objects retrieval endpoint', () => {
  let server

  beforeAll(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()

    await dmzStorage.createDmzContainers()
    await cleanStorage.createCleanContainers()
  })

  describe('GET /objects/{path}', () => {
    test('should retrieve a file if it exists in clean storage', async () => {
      const path = 'mock-file-id'
      await mockCleanBlob(path)

      const response = await server.inject({
        method: 'GET',
        url: `/objects/${path}`
      })

      expect(response.statusCode).toBe(200)
    })

    test('should return 404 if the file does not exist', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/objects/non-existent-file'
      })

      expect(response.statusCode).toBe(404)
    })
  })

  afterEach(async () => {
    await dmzContainers.objects.deleteIfExists()
    await cleanContainers.objects.deleteIfExists()
    await server.stop()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
