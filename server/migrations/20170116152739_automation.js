exports.up = function (knex) {
  return knex.schema
    .createTable('automation_scripts', function (table) {
      table.increments('id').primary().notNullable()
      table.string('script').notNullable()
      table.string('blockly_xml').notNullable()
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('automation_scripts')
}
