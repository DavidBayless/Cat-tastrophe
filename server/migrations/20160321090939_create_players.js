
exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', function(table) {
    table.increments();
    table.string('username');
    table.string('email');
    table.string('password');
    table.integer('wins');
    table.integer('losses');
    table.float('win_loss_ratio');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players');
};
