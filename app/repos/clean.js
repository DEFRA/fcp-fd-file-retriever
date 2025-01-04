import { containers } from '../storage/blob/clean.js'

const { objects: cleanObjects } = containers

const getObject = async (path) => {
  const blob = cleanObjects.getBlockBlobClient(path)
  const downloadBlockBlobResponse = await blob.download(0)
  return downloadBlockBlobResponse.readableStreamBody
}

export {
  getObject
}
