import {bookshelf} from '../lib/database'

class AutomationScript extends bookshelf.Model {
  get tableName () { return 'automation_scripts' }
}

export default bookshelf.model('AutomationScript', AutomationScript)
