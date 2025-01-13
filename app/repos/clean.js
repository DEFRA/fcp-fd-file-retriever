import { StatusCodes } from 'http-status-codes'
import { containers } from '../storage/blob/clean.js'
import { FILE_NOT_FOUND } from '../constants/file-errors.js'

const { objects: cleanObjects } = containers

const getObject = async (path) => {
  const blob = cleanObjects.getBlockBlobClient(path)
  try {
    return await blob.downloadToBuffer()
  } catch (err) {
    if (err.statusCode === StatusCodes.NOT_FOUND) {
      const error = new Error('Requested file not found')
      error.cause = FILE_NOT_FOUND
      throw error
    }

    throw err
  }
}

export {
  getObject
}
