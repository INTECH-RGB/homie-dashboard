export const CONDITIONS = {
  'IS_ON': { id: 'isOn', hasField: false },
  'IS_OFF': { id: 'isOff', hasField: false },
  'IS_OPEN': { id: 'isOpen', hasField: false },
  'IS_CLOSE': { id: 'isClose', hasField: false },
  'IS_MOTION': { id: 'isMotion', hasField: false },
  'IS_NOT_MOTION': { id: 'isNotMotion', hasField: false },
  'EQUALS': { id: 'equals', hasField: true },
  'ABOVE': { id: 'above', hasField: true },
  'UNDER': { id: 'under', hasField: true }
}

export const MUTATIONS = {
  'SET_ON': { id: 'setOn', hasField: false },
  'SET_OFF': { id: 'setOff', hasField: false },
  'SET_OPEN': { id: 'setOpen', hasField: false },
  'SET_CLOSE': { id: 'setClose', hasField: false },
  'SET_COLOR': { id: 'setColor', hasField: true },
  'SET_PERCENTAGE': { id: 'setPercentage', hasField: true },
  'SET_FLOAT': { id: 'setFloat', hasField: true }
}

export const NODE_TYPES = {
  'switch': {
    'on': {
      settable: true,
      conditions: [CONDITIONS.IS_ON, CONDITIONS.IS_OFF],
      mutations: [MUTATIONS.SET_ON, MUTATIONS.SET_OFF]
    }
  },
  'light': {
    'color': {
      settable: true,
      conditions: [],
      mutations: [MUTATIONS.SET_COLOR]
    },
    'intensity': {
      settable: true,
      conditions: [CONDITIONS.EQUALS, CONDITIONS.ABOVE, CONDITIONS.UNDER],
      mutations: [MUTATIONS.SET_PERCENTAGE]
    }
  },
  'temperature': {
    'degrees': {
      settable: false,
      conditions: [CONDITIONS.EQUALS, CONDITIONS.ABOVE, CONDITIONS.UNDER]
    }
  },
  'humidity': {
    'percentage': {
      settable: false,
      conditions: [CONDITIONS.EQUALS, CONDITIONS.ABOVE, CONDITIONS.UNDER]
    }
  },
  'shutters': {
    'percentage': {
      settable: true,
      conditions: [CONDITIONS.EQUALS, CONDITIONS.ABOVE, CONDITIONS.UNDER],
      mutations: [MUTATIONS.SET_PERCENTAGE]
    }
  },
  'door': {
    'open': {
      settable: false,
      conditions: [CONDITIONS.IS_OPEN, CONDITIONS.IS_CLOSE]
    }
  },
  'window': {
    'open': {
      settable: false,
      conditions: [CONDITIONS.IS_OPEN, CONDITIONS.IS_CLOSE]
    }
  },
  'lock': {
    'open': {
      settable: true,
      conditions: [CONDITIONS.IS_OPEN, CONDITIONS.IS_CLOSE],
      mutations: [MUTATIONS.SET_OPEN, MUTATIONS.SET_CLOSE]
    }
  },
  'heater': {
    'degrees': {
      settable: true,
      conditions: [CONDITIONS.EQUALS, CONDITIONS.ABOVE, CONDITIONS.UNDER],
      mutations: [MUTATIONS.SET_FLOAT]
    }
  },
  'sound': {
    'intensity': {
      settable: false,
      conditions: [CONDITIONS.EQUALS, CONDITIONS.ABOVE, CONDITIONS.UNDER]
    }
  },
  'luminosity': {
    'lux': {
      settable: false,
      conditions: [CONDITIONS.EQUALS, CONDITIONS.ABOVE, CONDITIONS.UNDER]
    }
  },
  'motion': {
    'motion': {
      settable: false,
      conditions: [CONDITIONS.IS_MOTION, CONDITIONS.IS_NOT_MOTION]
    }
  },
  'buzzer': {
    'buzzing': {
      settable: true,
      conditions: [CONDITIONS.IS_ON, CONDITIONS.IS_OFF],
      mutations: [MUTATIONS.SET_ON, MUTATIONS.SET_OFF]
    }
  }
}
