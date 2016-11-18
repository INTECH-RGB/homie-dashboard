export const TOPIC_TYPES = {
  BROADCAST: 'BROADCAST',
  DEVICE_PROPERTY: 'DEVICE_PROPERTY',
  NODE_SPECIAL_PROPERTY: 'NODE_SPECIAL_PROPERTY',
  NODE_PROPERTY: 'NODE_PROPERTY',
  NODE_PROPERTY_SET: 'NODE_PROPERTY_SET',
  INVALID: 'INVALID'
}

class HomieTopicParser {
  constructor (baseTopic = 'homie/') {
    this.setBaseTopic(baseTopic)
  }

  setBaseTopic (baseTopic) {
    this.baseTopic = baseTopic
  }

  parse (topic, value) {
    if (!topic.startsWith(this.baseTopic)) return { type: TOPIC_TYPES.INVALID }

    topic = topic.substr(this.baseTopic.length)  // Remove base topic
    const splittedTopic = topic.split('/')
    const length = splittedTopic.length

    if (length === 2 && splittedTopic[0] === '$broadcast') {  // Checking key word for global broadcast
      return {
        type: TOPIC_TYPES.BROADCAST,
        level: splittedTopic[1],
        value
      }
    } else if (length >= 2 && splittedTopic[1].startsWith('$')) {  // If [1] starts with $ then device property
      const deviceId = splittedTopic.shift()
      return {
        type: TOPIC_TYPES.DEVICE_PROPERTY,
        deviceId,
        property: splittedTopic.join('/').substr(1),  // Remove $
        value
      }
    } else if (length === 3 && splittedTopic[2].startsWith('$')) {  // If [2] starts with $ then node special property
      return {
        type: TOPIC_TYPES.NODE_SPECIAL_PROPERTY,
        deviceId: splittedTopic[0],
        nodeId: splittedTopic[1],
        property: splittedTopic[2].substr(1),
        value
      }
    } else if (length === 3) {  // Checking length to ensure there is no error in the topic
      return {
        type: TOPIC_TYPES.NODE_PROPERTY,
        deviceId: splittedTopic[0],
        nodeId: splittedTopic[1],
        property: splittedTopic[2],
        value
      }
    } else if (length === 4 && splittedTopic[3] === 'set') {  // If length is 4 and [5] is set then set
      return {
        type: TOPIC_TYPES.NODE_PROPERTY_SET,
        deviceId: splittedTopic[0],
        nodeId: splittedTopic[1],
        property: splittedTopic[2],
        value
      }
    } else {  // An error has occured, topic must be one of the above
      return { type: TOPIC_TYPES.INVALID }
    }
  }
}

export default new HomieTopicParser()
