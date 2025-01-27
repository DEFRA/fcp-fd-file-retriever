import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { containers, sharedKeyCredential } from '../../storage/blob/clean.js'
import { createServiceBlobSasToken } from '../../storage/sas-token/blob.js'

const internalObjects = {
  method: 'GET',
  path: '/internal/objects/{id}',
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
      const blob = createServiceBlobSasToken(containerClient, id, sharedKeyCredential)
      return h.response(blob).code(StatusCodes.OK)
    } catch (error) {
      console.error('Error retrieving blob:', error)
      return h.response({ error: 'Failed to retrieve blob' }).code(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}

export default internalObjects
