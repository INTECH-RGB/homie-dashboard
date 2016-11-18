import test from 'ava'

import homieTopicParser, {TOPIC_TYPES} from '../server/lib/homie-topic-parser'

test('parse a broadcast', t => {
  const result = homieTopicParser.parse('homie/$broadcast/level', 'value')
  t.deepEqual(result, {
    type: TOPIC_TYPES.BROADCAST,
    level: 'level',
    value: 'value'
  })
})
