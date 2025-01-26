import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { internalBlobAccess } from '../services/internal-blob-access.js'

const internalObjectsBuffer = {
  method: 'GET',
  path: '/internal/objects/buffer/{path}',
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().uuid({ version: 'uuidv4' }).required()
      })
    }
  },
  handler: async (request, h) => {
    const { path } = request.params

    try {
      const blobBuffer = await internalBlobAccess(path)

      return h.response(blobBuffer).code(StatusCodes.OK)
    } catch (error) {
      console.error('Error retrieving blob:', error)
      return h.response({ error: 'Failed to retrieve blob' }).code(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}

export default internalObjectsBuffer
