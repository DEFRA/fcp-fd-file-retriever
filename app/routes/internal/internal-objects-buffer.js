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

    try {
      const containerClient = containers.objects
      const sasUrl = createServiceBlobSasToken(containerClient, id, sharedKeyCredential)
      const response = await fetch(sasUrl)
      const buffer = await response.arrayBuffer()

      return h.response(Buffer.from(buffer))
        .header('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream')
        .header('Content-Length', buffer.byteLength)
        .code(StatusCodes.OK)
    } catch (error) {
      console.error('Error retrieving blob:', error)
      return h.response({ error: 'Failed to retrieve blob' }).code(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}

export default internalObjectsBuffer
