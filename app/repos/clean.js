import { containers } from '../storage/blob/clean.js'
import { FILE_NOT_FOUND } from '../constants/file-errors.js'

const { objects: cleanObjects } = containers

const getObject = async (path) => {
  const blob = cleanObjects.getBlockBlobClient(path)
  try {
    return blob.downloadToBuffer()
  } catch (err) {
    if (err.statusCode === 404) {
      throw new Error('Requested file not found', { cause: FILE_NOT_FOUND })
    }

    throw err
  }
}

export {
  getObject
}
