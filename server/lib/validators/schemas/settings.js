export default {
  'title': 'Settings',
  'type': 'object',
  'properties': {
    'bindings': {
      'type': 'object',
      'properties': {
        'aqara': {
          'type': 'object',
          'properties': {
            'enabled': {
              'type': 'boolean'
            },
            'gateway': {
              'type': 'object',
              'properties': {
                'ip': {
                  'type': 'string'
                },
                'password': {
                  'type': 'string'
                }
              },
              'required': ['ip', 'password']
            }
          },
          'required': ['enabled', 'gateway']
        },
        'yeelight': {
          'type': 'object',
          'properties': {
            'enabled': {
              'type': 'boolean'
            }
          },
          'required': ['enabled']
        }
      },
      'required': ['aqara', 'yeelight']
    },
    'mqtt': {
      'type': 'object',
      'properties': {
        'host': {
          'type': 'string'
        },
        'port': {
          'type': 'integer'
        }
      },
      'required': ['host', 'port']
    },
    'homie-esp8266': {
      'type': 'object',
      'properties': {
        'wifi': {
          'type': 'object',
          'properties': {
            'ssid': {
              'type': 'string'
            },
            'password': {
              'type': 'string'
            }
          },
          'required': ['ssid', 'password']
        },
        'mqtt': {
          'type': 'object',
          'properties': {
            'host': {
              'type': 'string'
            },
            'port': {
              'type': 'integer'
            }
          },
          'required': ['host', 'port']
        }
      },
      'required': ['wifi', 'mqtt']
    }
  },
  'required': ['bindings', 'mqtt', 'homie-esp8266']
}
