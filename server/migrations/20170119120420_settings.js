import speakeasy from 'speakeasy'

exports.up = function (knex) {
  return Promise.all([
    knex.schema
      .createTable('settings', function (table) {
        table.string('key').primary().notNullable()
        table.string('value').notNullable()
      }).then(function () {
        return knex('settings').insert([
          { key: 'password', value: '75c9aa9127e43df7b1e8f4bad7d887d4,adde47c3d7894070ffab1ca6b855761ffe942a0b3965ba534b67c46a84fcda56' },
          { key: 'otp_secret', value: speakeasy.generateSecret().base32 }
        ])
      })
  ])
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('settings')
}
