import storage from '../config/storage.js'
import { AV_SCAN_TIMEOUT, CLEAN_FILE, MALICIOUS_FILE } from '../constants/av-results.js'
import { getObject, getAvScanStatus } from '../repos/dmz.js'

const avPollingInterval = storage.get('dmz.avScanPollingInterval')
const avScanMaxAttempts = storage.get('dmz.avScanMaxAttempts')

const waitForAvScan = async (id, interval) => {
  let avResult
  let attempts = 0

  do {
    try {
      avResult = await getAvScanStatus(id)
    } catch (err) {
      console.error(`An error occurred while polling AV scan status for ${id}:`, err)
    }

    if (!avResult) {
      await new Promise(resolve => setTimeout(resolve, interval))
    }

    attempts += 1
  } while (!avResult && attempts < avScanMaxAttempts)

  if (!avResult) {
    throw new Error(`AV scan for ${id} timed out after ${attempts} attempts`, { cause: AV_SCAN_TIMEOUT })
  }

  switch (avResult.status) {
    case CLEAN_FILE:
      return avResult
    case MALICIOUS_FILE:
      throw new Error('Requested file has been identified as malicious', { cause: MALICIOUS_FILE })
    default:
      throw new Error('An error occurred while scanning the requested file', { cause: avResult.status })
  }
}

const retrieveFile = async (id) => {
  try {
    await waitForAvScan(id, avPollingInterval)
    const file = await getObject(id)

    return [file, null]
  } catch (err) {
    console.error(err)

    return [null, err]
  }
}

export {
  retrieveFile
}
