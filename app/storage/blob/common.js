const uploadBlob = async (client, file, path, attributes) => {
  try {
    const blob = client.getBlockBlobClient(path)

    await blob.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: attributes.contentType
      }
    })
  } catch (err) {
    console.error('An error occurred while uploading blob:', err)

    throw err
  }
}

export {
  uploadBlob
}
