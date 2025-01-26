import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { handleObjectRetrieval } from '../services/retrieve.js'
import { handleRetrievalError } from '../storage/blob/handle-retrieval-error.js'

const objects = {
  method: 'GET',
  path: '/objects/{id}',
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

export default objects
