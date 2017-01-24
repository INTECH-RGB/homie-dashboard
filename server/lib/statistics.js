import {bookshelf} from './database'
import {STATS_TYPES, STATS_GRANULARITY} from '../../common/statistics'

export async function getStatistics (opts) {
  const {deviceId, nodeId, propertyId, type, granularity, range} = opts

  console.log(opts)

  if (type === STATS_TYPES.GRAPH) {
    let result
    switch (granularity) {
      case STATS_GRANULARITY.HOUR:
        result = await bookshelf.knex.raw(`
          SELECT
            date(date / 1000, 'unixepoch') AS day,
            strftime('%H', datetime(date / 1000, 'unixepoch')) AS hour,
            min(CAST(value AS NUMERIC)) AS minimum,
            avg(CAST(value AS NUMERIC)) AS average,
            max(CAST(value AS NUMERIC)) AS maximum
          FROM property_history h
          INNER JOIN properties p ON h.property_id = p.id
          INNER JOIN nodes n ON p.node_id = n.id
          INNER JOIN devices d ON n.device_id = d.id
          WHERE d.id = ? AND n.device_node_id = ? AND p.node_property_id = ? AND day = ?
          GROUP BY day, hour
          ORDER BY day, hour;
        `, [deviceId, nodeId, propertyId, range.day])

        console.log(result)
        return result
      case STATS_GRANULARITY.DAY:
        result = await bookshelf.knex.raw(`
          SELECT
            date(date / 1000, 'unixepoch') AS day,
            min(CAST(value AS NUMERIC)) AS minimum,
            avg(CAST(value AS NUMERIC)) AS average,
            max(CAST(value AS NUMERIC)) AS maximum
          FROM property_history h
          INNER JOIN properties p ON h.property_id = p.id
          INNER JOIN nodes n ON p.node_id = n.id
          INNER JOIN devices d ON n.device_id = d.id
          WHERE d.id = ? AND n.device_node_id = ? AND p.node_property_id = ? AND day BETWEEN ? AND ? -- included
          GROUP BY day
          ORDER BY day;
        `, [deviceId, nodeId, propertyId, range.startDay, range.endDay])

        console.log(result)
        return result
    }
  } else if (type === STATS_TYPES.LIST) {

  }
}
