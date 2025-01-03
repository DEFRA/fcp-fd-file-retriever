import { containers } from '../storage/blob/clean.js'

const { objects } = containers

const getObject = async (path) => {
  const blob = objects.getBlockBlobClient(path)
  const downloadBlockBlobResponse = await blob.download(0)
  return downloadBlockBlobResponse.readableStreamBody
}

export {
  getObject
}
