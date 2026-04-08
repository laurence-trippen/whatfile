const fsp = require("node:fs/promises")

const PDF_STANDARD_HEADER = "%PDF-"
const PDF_HEADER_SIZE = 5
const PDF_TAIL_SIZE = 4096
const PDF_PASSWORD_BYTE_INDICATOR = Buffer.from("/Encrypt")

async function isPdf(path) {
  const fileHandle = await fsp.open(path, "r")

  try {
    // Alloc zero-ed buffer for file header
    const header = Buffer.alloc(PDF_HEADER_SIZE)

    // Fill header-buffer
    const OFFSET = 0
    const POSITION = 0
    await fileHandle.read(header, OFFSET, PDF_HEADER_SIZE, POSITION)

    // Check header
    const isPDF = header.equals(PDF_STANDARD_HEADER)
    return isPDF
  } catch (e) {
    return false
  } finally {
    await fileHandle.close()
  }
}

async function hasPdfPassword(path) {
  const isPDF = await isPdf(path)
  if (!isPDF) return false

  const fileHandle = await fsp.open(path, "r")

  try {
    const { size } = await fileHandle.stat()

    const tailStart = Math.max(0, size - PDF_TAIL_SIZE)
    const tail = Buffer.alloc(size - tailStart)

    const OFFSET = 0
    await fileHandle.read(tail, OFFSET, tail.length, tailStart)

    const hasPassword = tail.indexOf(PDF_PASSWORD_BYTE_INDICATOR) !== -1
    return hasPassword
  } catch (e) {
    return false
  } finally {
    await fileHandle.close()
  }
}

module.exports = {
  PDF_STANDARD_HEADER,
  PDF_PASSWORD_BYTE_INDICATOR,
  isPdf,
  hasPdfPassword,
}
