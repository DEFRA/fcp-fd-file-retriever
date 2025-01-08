import * as cleanRepo from '../repos/clean.js'

const handleFileRetrieval = async (path) => {
  let file

  try {
    file = await cleanRepo.getObject(path)
    console.log(`File ${path} retrieved from clean storage.`)
    return [file, null]
  } catch (err) {
    return [null, err]
  }
}

export {
  handleFileRetrieval
}
