import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { containers, sharedKeyCredential } from '../../storage/blob/clean.js'
import { createServiceBlobSasToken } from '../../storage/sas-token/blob.js'

const internalObjectsBuffer = {
  method: 'GET',
  path: '/internal/objects/buffer/{id}',
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().uuid({ version: 'uuidv4' }).required()
      })
    }
  },
  handler: async (request, h) => {
    const { id } = request.params
    const containerClient = containers.objects

    try {
      const blobUrl = createServiceBlobSasToken(containerClient, id, sharedKeyCredential)

      const response = await fetch(blobUrl)
      if (!response.ok) {
        console.error(`Failed to fetch blob. Status: ${response.status}`)
        throw new Error(`Failed to fetch blob. Status: ${response.status}`)
      }

      const blobBuffer = await response.buffer()

      return h.response(blobBuffer)
        .header('Content-Type', response.headers.get('content-type') || 'application/octet-stream')
        .header('Content-Disposition', `attachment; filename="${id}"`)
        .code(StatusCodes.OK)
    } catch (error) {
      console.error('Error retrieving blob:', error.message)
      return h.response({ error: 'Failed to retrieve blob content' }).code(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}

export default internalObjectsBuffer
