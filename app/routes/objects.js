import { handleFileRetrieval } from '../services/retrieve.js'
import { MALICIOUS_FILE } from '../constants/av-results.js'
import { FILE_NOT_FOUND } from '../constants/file-errors.js'

const handleRetrievalError = (err, h) => {
  switch (err?.cause) {
    case MALICIOUS_FILE:
      return h.response({
        errors: ['Requested file has been identified as malicious.']
      }).code(403)
    case FILE_NOT_FOUND:
      return h.response().code(404)
    default:
      throw err
  }
}

const objects = {
  method: 'GET',
  path: '/objects/{path}',
  handler: async (request, h) => {
    const { path } = request.params

    const [file, err] = await handleFileRetrieval(path)

    if (err) {
      return handleRetrievalError(err, h)
    }

    return h.response(file).code(200)
  }
}

export default objects
