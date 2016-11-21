import fs from 'fs'
import path from 'path'

import toml from 'toml'

export default function load () {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../../settings.toml'), 'utf8', (err, data) => {
      if (err) return reject(err)

      const settings = toml.parse(data)
      resolve(settings)
    })
  })
}
