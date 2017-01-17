import bcrypt from 'bcryptjs'

export function hash (password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(function (err, salt) {
      if (err) return reject(err)
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return reject(err)
        resolve(hash)
      })
    })
  })
}

export async function verify (hash, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, res) {
      if (err) return reject(err)
      resolve(res)
    })
  })
}
