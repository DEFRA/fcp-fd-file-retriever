import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

import { handleObjectRetrieval } from '../services/retrieve.js'
import { FILE_NOT_FOUND } from '../constants/file-errors.js'

const handleRetrievalError = (err, h) => {
  switch (err?.cause) {
    case FILE_NOT_FOUND:
      return h.response().code(StatusCodes.NOT_FOUND)
    default:
      throw err
  }
}

const objects = {
  method: 'GET',
  path: '/objects/{id}',
  handler: async (request, h) => {
    const { id } = request.params

    const [fileObject, err] = await handleObjectRetrieval(id)

    if (err) {
      return handleRetrievalError(err, h)
    }

    return h.response(fileObject).code(StatusCodes.OK)
  },
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().uuid({ version: 'uuidv4' }).required()
      })
    }
  }
}

export default objects
