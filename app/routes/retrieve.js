import { handleFileRetrieval } from '../services/retrieve.js'
import { MALICIOUS_FILE } from '../constants/av-results.js'
import { FILE_NOT_FOUND } from '../constants/file-errors.js'

const retrieve = {
  method: 'GET',
  path: '/objects/{path}',
  handler: async (request, h) => {
    const { path } = request.params
    const [file, err] = await handleFileRetrieval(path)

    if (err) {
      if (err.cause === MALICIOUS_FILE) {
        return h.response({
          errors: ['Requested file has been identified as malicious.']
        }).code(403)
      }

      if (err.cause === FILE_NOT_FOUND) {
        return h.response().code(404)
      }

      throw err
    }

    return h.response(file).code(200)
  }
}

export default retrieve
