import Device from '../lib/infrastructure/device'
import Node from '../lib/infrastructure/node'
import Property from '../lib/infrastructure/property'
import Tag from '../lib/infrastructure/tag'
import Floor from '../lib/infrastructure/floor'
import Room from '../lib/infrastructure/room'

import DeviceModel from '../models/device'
import TagModel from '../models/tag'
import FloorModel from '../models/floor'
import AutomationScript from '../models/automation-script'

/**
 * This function synchronizes the database with the infrastructure.
 * It iterates through all devices, nodes, properties and tags of the SQLite database,
 * and updates the infrastructure accordingly
 * @param {Infrastructure} infrastructure the infrastructure to synchronize against
 * @returns {Promise} promise, to be resolved on success or rejected on failure
 */
export async function getInfrastructure (infrastructure) {
  /* Tags */

  const tags = await TagModel.fetchAll()

  for (const tagInDb of tags.models) {
    const tag = new Tag()
    tag.model = tagInDb
    tag.id = tagInDb['id']
    infrastructure.addTag(tag)
  }

  /* Automation */

  const automationScripts = await AutomationScript.fetchAll()

  for (const automationScriptInDb of automationScripts.models) {
    const automationInInfra = infrastructure.getAutomation()
    automationInInfra.model = automationScriptInDb
    infrastructure.setAutomation({
      xml: automationScriptInDb.attributes['blockly_xml'],
      script: automationScriptInDb.attributes['script']
    })
  }

  /* House */

  const floors = await FloorModel
    .fetchAll({ withRelated: ['rooms'] })

  for (const floorInDb of floors.models) {
    const floor = new Floor()
    floor.model = floorInDb
    floor.id = floorInDb.attributes['id']
    floor.name = floorInDb.attributes['name']
    floor.roomsMap = JSON.parse(floorInDb.attributes['rooms_map'])
    infrastructure.addFloor(floor)

    for (const roomInDb of floorInDb.related('rooms').models) {
      const room = new Room()
      room.model = roomInDb
      room.floor = floor
      room.id = roomInDb.attributes['id']
      room.name = roomInDb.attributes['name']
      room.tagId = roomInDb.attributes['tag_id']
      floor.addRoom(room)
    }
  }

  /* Devices */

  const devices = await DeviceModel
    .fetchAll({ withRelated: ['nodes', 'nodes.tags', 'nodes.properties', {
      'nodes.properties.history': function (qb) {
        qb.groupBy('property_id')
      }
    }]})

  for (const deviceInDb of devices.models) {
    const device = new Device()
    device.model = deviceInDb
    device.id = deviceInDb.attributes['id']
    device.name = deviceInDb.attributes['name']
    device.online = deviceInDb.attributes['online']
    device.localIp = deviceInDb.attributes['local_ip']
    device.mac = deviceInDb.attributes['mac']
    device.setStatProperty('signal', parseInt(deviceInDb.attributes['stats_signal'], 10))
    device.setStatProperty('uptime', parseInt(deviceInDb.attributes['stats_uptime'], 10))
    device.setStatProperty('interval', parseInt(deviceInDb.attributes['stats_interval_in_seconds'], 10))
    device.setFirmwareProperty('name', deviceInDb.attributes['fw_name'])
    device.setFirmwareProperty('version', deviceInDb.attributes['fw_version'])
    device.setFirmwareProperty('checksum', deviceInDb.attributes['fw_checksum'])
    device.implementation = deviceInDb.attributes['implementation']

    for (const nodeInDb of deviceInDb.related('nodes').models) {
      const node = new Node()
      node.model = nodeInDb
      node.device = device
      node.id = nodeInDb.attributes['device_node_id']
      node.type = nodeInDb.attributes['type']
      node.propertiesDefinition = nodeInDb.attributes['properties']
      for (const tagInDb of nodeInDb.related('tags').models) {
        node.addTag(infrastructure.getTag(tagInDb.attributes.id))
      }

      for (const propertyInDb of nodeInDb.related('properties').models) {
        const property = new Property()
        property.model = propertyInDb
        property.node = node
        property.id = propertyInDb.attributes['node_property_id']
        property.value = propertyInDb.related('history').models.length === 1 ? propertyInDb.related('history').models[0].attributes['value'] : null
        property.settable = propertyInDb.attributes['settable']

        node.addProperty(property)
      }

      device.addNode(node)
    }

    infrastructure.addDevice(device)
  }
}
