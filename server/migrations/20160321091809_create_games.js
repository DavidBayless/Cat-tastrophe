
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', function(table) {
    table.increments();
    table.integer('level');
    table.string('name');
    table.string('password');
    table.boolean('isStarted');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games');
};
