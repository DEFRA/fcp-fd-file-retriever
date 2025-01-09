import { beforeAll, describe, expect, jest, test } from '@jest/globals'
import { v4 as uuidv4 } from 'uuid'

import * as cleanStorage from '../../../../app/storage/blob/clean.js'

import { pdf } from '../../../mocks/files.js'

const { containers: cleanContainers } = cleanStorage

const mockCleanBlob = jest.fn(async (id) => {
  const client = cleanContainers.objects.getBlockBlobClient(id)
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

  beforeAll(async () => {
    jest.resetModules()
    jest.clearAllMocks()

    for (const container of Object.keys(cleanContainers)) {
      await cleanContainers[container].createIfNotExists()
    }
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  describe('GET /objects/{id}', () => {
    test('should retrieve a file if it exists in clean storage', async () => {
      const id = '24d1eb1d-1045-44be-9f08-1511701648e9'
      await mockCleanBlob(id)

      const response = await server.inject({
        method: 'GET',
        url: `/objects/${id}`
      })

      expect(response.statusCode).toBe(200)
    })

    test('should return 404 if the file does not exist', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/objects/24d1eb1d-1045-44be-9f08-1511701648e9'
      })

      expect(response.statusCode).toBe(404)
    })

    test('should throw 400 validation error when id not a UUID', async () => {
      const id = 'invalid-id'

      const response = await server.inject({
        method: 'GET',
        url: `/objects/${id}`
      })

      expect(response.statusCode).toBe(400)
    })

    test('should throw generic error in all other cases', async () => {
      const id = uuidv4()

      try {
        const response = await server.inject({
          method: 'GET',
          url: `/objects/${id}`
        })

        expect(response.statusCode).not.toBe(200)
      } catch (err) {
        expect(err.statusCode).not.toBe(400)
        expect(err.statusCode).not.toBe(404)
      }
    })
  })

  afterEach(async () => {
    await cleanContainers.objects.deleteIfExists()
    await server.stop()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
