import { MALICIOUS_FILE } from '../constants/av-results.js'

import * as cleanRepo from '../repos/clean.js'
import * as maliciousRepo from '../repos/malicious.js'

const handleFileRetrieval = async (path) => {
  let file

  try {
    file = await cleanRepo.getObject(path)
    console.log(`File ${path} retrieved from clean storage.`)
    return [file, null]
  } catch (err) {
    if (err.cause === MALICIOUS_FILE) {
      console.warn(`Requested file ${path} has been identified as malicious. Moving to quarantine.`)
      await maliciousRepo.quarantineObject(file, path)
    }

    return [null, err]
  }
}

export {
  handleFileRetrieval
}
