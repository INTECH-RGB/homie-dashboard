import {bookshelf} from '../lib/database'

class Setting extends bookshelf.Model {
  get tableName () { return 'settings' }
  get idAttribute () { return 'key' }
}

export default bookshelf.model('Setting', Setting)
