import axios from 'axios'

let baseUrl
if (process.env.NODE_ENV === 'production') {
  const l = window.location
  baseUrl = ((l.protocol === 'https:') ? 'https://' : 'http://') + l.host
} else {
  baseUrl = 'http://127.0.0.1:5000'
}

export async function login (password) {
  return new Promise((resolve, reject) => {
    axios.post(`${baseUrl}/login`, {
      password
    }, { withCredentials: true }).then((res) => {
      return resolve(true)
    }).catch((err) => {
      if (err.response) return resolve(false)
      else return reject(err)
    })
  })
}

export async function logout () {
  return new Promise((resolve, reject) => {
    axios.post(`${baseUrl}/logout`, null, { withCredentials: true }).then((res) => {
      return resolve(true)
    }).catch((err) => {
      if (err.response) return resolve(false)
      else return reject(err)
    })
  })
}
