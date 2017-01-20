import crypto from 'crypto'

function _generateSalt () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, function (err, randomBytes) {
      if (err) return reject(err)

      resolve(randomBytes.toString('hex'))
    })
  })
}

function _generateHash (string) {
  return crypto.createHash('sha256').update(string, 'utf-8').digest('hex')
}

export async function hash (password) {
  const salt = await _generateSalt()
  const hash = _generateHash(`${salt}${password}`)

  return `${salt},${hash}`
}

export async function verify (hash, password) {
  const splitted = hash.split(',')
  const salt = splitted[0]
  const concreteHash = splitted[1]

  return _generateHash(`${salt}${password}`) === concreteHash
}
