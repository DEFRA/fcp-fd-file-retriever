import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { handleObjectRetrieval } from '../services/retrieve.js'
import { handleRetrievalError } from '../storage/blob/handle-retrieval-error.js'
// import { createBlobSasToken } from '../storage/sas-token/blob'

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

    const [fileObject, err] = await handleObjectRetrieval(id)

    if (err) {
      return handleRetrievalError(err, h)
    }
    return h.response(fileObject).code(StatusCodes.OK)
  }
}

export default internalObjects
