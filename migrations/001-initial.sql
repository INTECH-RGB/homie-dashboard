--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE devices (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  online INTEGER NOT NULL, -- SQLite BOOLEAN
  ip TEXT NOT NULL,
  stats_signal INTEGER,
  stats_uptime INTEGER NOT NULL,
  stats_interval_in_seconds INTEGER NOT NULL,
  fw_name TEXT NOT NULL,
  fw_version TEXT NOT NULL,
  implementation TEXT NOT NULL,
  added INTEGER NOT NULL, -- SQLite BOOLEAN

  CONSTRAINT devices_online_ck CHECK (online IN (0, 1)),
  CONSTRAINT devices_added_ck CHECK (added IN (0, 1))
);

CREATE TABLE nodes (
  id INTEGER PRIMARY KEY NOT NULL,
  device_id TEXT NOT NULL,
  device_node_id TEXT NOT NULL,
  type TEXT NOT NULL,

  CONSTRAINT nodes_device_id_fk FOREIGN KEY(device_id) REFERENCES devices(id),
  CONSTRAINT nodes_node_per_device_uq UNIQUE(device_id, device_node_id) ON CONFLICT REPLACE
);

CREATE TABLE properties (
  id INTEGER PRIMARY KEY NOT NULL,
  node_id INTEGER NOT NULL,
  node_property_id TEXT NOT NULL,

  CONSTRAINT properties_node_id_fk FOREIGN KEY(node_id) REFERENCES nodes(id),
  CONSTRAINT properties_property_per_node_uq UNIQUE(node_id, node_property_id) ON CONFLICT REPLACE
);

CREATE TABLE property_history (
  id INTEGER PRIMARY KEY NOT NULL,
  property_id INTEGER NOT NULL,
  value TEXT NOT NULL,
  date TEXT NOT NULL, -- SQLite DATETIME,

  CONSTRAINT property_history_property_id_fk FOREIGN KEY(property_id) REFERENCES properties(id)
);

CREATE TABLE IFTTT (
  id INTEGER PRIMARY KEY NOT NULL,
  I_property_id INTEGER NOT NULL,
  condition TEXT NOT NULL,
  O_property_id INTEGER NOT NULL,
  O_value TEXT NOT NULL,

  CONSTRAINT IFTTT_I_property_id_fk FOREIGN KEY(I_property_id) REFERENCES properties(id),
  CONSTRAINT IFTTT_O_property_id_fk FOREIGN KEY(O_property_id) REFERENCES properties(id),
  CONSTRAINT IFTTT_whole_condition_uq UNIQUE(I_property_id, condition, O_property_id) ON CONFLICT REPLACE
);

CREATE TABLE settings (
  id TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE settings;
DROP TABLE IFTTT;
DROP TABLE property_history;
DROP TABLE properties;
DROP TABLE nodes;
DROP TABLE devices;
