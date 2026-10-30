import fs from 'node:fs'

if (!fs.existsSync('gh-pages')) {
  fs.mkdirSync('gh-pages')
}
