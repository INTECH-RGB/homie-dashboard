import Ajv from 'ajv'
import schema from './schemas/settings'

const ajv = new Ajv()

export function validate (settings) {
  const valid = ajv.validate(schema, settings)
  if (valid) return { valid }
  else return { valid, errors: ajv.errors }
}
