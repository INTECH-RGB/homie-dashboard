import argon2 from 'argon2'

export async function hash (password) {
  const salt = await argon2.generateSalt()
  const hash = await argon2.hash(password, salt)

  return hash
}

export async function verify (hash, password) {
  return await argon2.verify(hash, password)
}
