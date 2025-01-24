import { StatusCodes } from 'http-status-codes'
import { FILE_NOT_FOUND } from '../../constants/file-errors.js'

const handleRetrievalError = (err, h) => {
  if (err?.cause === FILE_NOT_FOUND) {
    return h.response().code(StatusCodes.NOT_FOUND)
  } else {
    throw err
  }
}

export { handleRetrievalError }
