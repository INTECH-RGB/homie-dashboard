import fs from 'fs'
import path from 'path'

import toml from 'toml'

/**
 * This function loads settings from a TOML file
 * @returns {Promise} promise, to be resolved on success with the settings or rejected on failure
 */
export default function load (dataDir) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(dataDir, './settings.toml'), 'utf8', (err, data) => {
      if (err) return reject(err)

      const settings = toml.parse(data)
      resolve(settings)
    })
  })
}
