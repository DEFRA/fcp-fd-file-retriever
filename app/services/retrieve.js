import { MALICIOUS_FILE } from '../constants/av-results.js'

import * as cleanRepo from '../repos/clean.js'

const handleFileRetrieval = async (id) => {
  try {
    const file = await cleanRepo.getObject(id)
    console.logconsole.log(`File ${id} retrieved from clean storage.`)
    return [file, null]
  } catch (err) {
    if (err.cause === MALICIOUS_FILE) {
      console.warn(`Requested file ${id} has been identified as malicious.`)
      return [null, err]
    }

    console.error(`An error occurred while retrieving file ${id}:`, err)
    return [null, err]
  }
}

export {
  handleFileRetrieval
}
