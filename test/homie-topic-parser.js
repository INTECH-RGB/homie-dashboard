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

test('report invalid first level topic', t => {
  const result = homieTopicParser.parse('homie/$lolipop', 'value')
  t.deepEqual(result, {
    type: TOPIC_TYPES.INVALID
  })
})

test('parse a device property', t => {
  const result = homieTopicParser.parse('homie/device/$property', 'value')
  t.deepEqual(result, {
    type: TOPIC_TYPES.DEVICE_PROPERTY,
    deviceId: 'device',
    property: 'property',
    value: 'value'
  })
})

test('parse a device property with subtopics', t => {
  const result = homieTopicParser.parse('homie/device/$fw/name', 'value')
  t.deepEqual(result, {
    type: TOPIC_TYPES.DEVICE_PROPERTY,
    deviceId: 'device',
    property: 'fw/name',
    value: 'value'
  })
})

test('parse a node special property', t => {
  const result = homieTopicParser.parse('homie/device/node/$special', 'value')
  t.deepEqual(result, {
    type: TOPIC_TYPES.NODE_SPECIAL_PROPERTY,
    deviceId: 'device',
    nodeId: 'node',
    property: 'special',
    value: 'value'
  })
})

test('parse a node property', t => {
  const result = homieTopicParser.parse('homie/device/node/property', 'value')
  t.deepEqual(result, {
    type: TOPIC_TYPES.NODE_PROPERTY,
    deviceId: 'device',
    nodeId: 'node',
    property: 'property',
    value: 'value'
  })
})

test('parse a node property set topic', t => {
  const result = homieTopicParser.parse('homie/device/node/property/set', 'value')
  t.deepEqual(result, {
    type: TOPIC_TYPES.NODE_PROPERTY_SET,
    deviceId: 'device',
    nodeId: 'node',
    property: 'property',
    value: 'value'
  })
})
