--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE floors (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,

  CONSTRAINT floors_name_ck CHECK(name <> '')
);

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  floor_id INTEGER NOT NULL,
  tag_id TEXT NOT NULL,

  CONSTRAINT rooms_floor_id_fk FOREIGN KEY(floor_id) REFERENCES floors(id) ON DELETE CASCADE,
  CONSTRAINT rooms_tag_id_fk FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  CONSTRAINT rooms_name_ck CHECK(name <> '')
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE rooms;
DROP TABLE floors;
