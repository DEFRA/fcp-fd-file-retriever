import * as cleanRepo from '../repos/clean.js'

const handleObjectRetrieval = async (id) => {
  let fileObject

  try {
    fileObject = await cleanRepo.getObject(id)
    console.log(`File ${id} retrieved from clean storage.`)
    return [fileObject, null]
  } catch (err) {
    return [null, err]
  }
}

export {
  handleObjectRetrieval
}
