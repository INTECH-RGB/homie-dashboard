exports.up = function (knex) {
  return Promise.all([
    knex.schema
      .createTable('settings', function (table) {
        table.string('key').primary().notNullable()
        table.string('value').notNullable()
      }).then(function () {
        return knex('settings').insert([
          { key: 'password', value: '$2a$10$hYnFXjXkyXprVEWXFV5zHOUff3oE0ec.5Yb6rBjnyYhIFQuOk3iQm' }
        ])
      })
  ])
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('settings')
}
