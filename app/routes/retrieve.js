import { MALICIOUS_FILE } from '../constants/av-results.js'
import { retrieveFile } from '../services/retrieve.js'

const retrieve = {
  method: 'GET',
  path: '/object/{path}',
  handler: async (request, h) => {
    const { path } = request.params
    const [file, err] = await retrieveFile(path)

    if (err) {
      if (err.cause === MALICIOUS_FILE) {
        return h.response({
          errors: ['Requested file has been identified as malicious.']
        }).code(403)
      }

      throw err
    }

    return h.response(file).code(200)
  }
}

export default retrieve
