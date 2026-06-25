# whatfile

A small Node.js library for detecting file types by their byte signatures (magic
bytes). Instead of loading a whole file into memory, `whatfile` opens the file
and reads only the few bytes it needs from disk.

This is useful when you deal with large files, untrusted uploads, or simply want
a quick, dependency-free way to verify that a file really is what its extension
claims to be.

## Installation

```sh
npm install whatfile
```

[npm link](https://www.npmjs.com/package/@laurence-trippen/whatfile)

Requires Node.js 22 (see `.nvmrc`).

## Usage

The library is organized one module per format, exposed under a namespaced key.
Currently only PDF is implemented.

```js
const { PDF } = require("whatfile")

async function main() {
  const isPdf = await PDF.isPdf("./report.pdf")
  console.log(isPdf) // true

  const isEncrypted = await PDF.hasPdfPassword("./report.pdf")
  console.log(isEncrypted) // true if the PDF is password protected
}

main()
```

## API

### `PDF.isPdf(path)`

Reads the file header and checks for the `%PDF-` signature.

- **path** `string` — path to the file on disk.
- **Returns** `Promise<boolean>` — `true` if the file starts with a valid PDF
  header, otherwise `false`.

Detection failures (missing file, permission errors, …) resolve to `false`
rather than throwing, so the function is safe to call without a `try/catch`.

### `PDF.hasPdfPassword(path)`

Checks whether a PDF is password protected by scanning the tail of the file for
an `/Encrypt` entry. Only the last few kilobytes are read, so this works on large
files too.

- **path** `string` — path to the file on disk.
- **Returns** `Promise<boolean>` — `true` if the file is a PDF and appears to be
  encrypted, otherwise `false`. Returns `false` for non-PDF files.

## How it works

Each detection function opens the file with `fs/promises`, reads only the bytes
it needs into a pre-allocated buffer, and always closes the file handle
afterwards. Two access patterns are used:

- **Header read** — read a small fixed-size chunk from the start of the file and
  compare it against a known magic-byte constant.
- **Tail read** — `stat()` the file, then read only the last chunk to look for
  indicator bytes (for example `/Encrypt`). This avoids loading large files
  entirely.

## TypeScript

Type declarations ship with the package, so no separate `@types` install is
needed.

## Roadmap

Additional formats are planned and will follow the same one-module-per-format
pattern.

## License

MIT © Laurence Louis Trippen
