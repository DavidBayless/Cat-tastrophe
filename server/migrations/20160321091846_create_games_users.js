
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games_users', function(table) {
    table.increments();
    table.integer('playerId');
    table.integer('gameId');
    table.boolean('gameOwner');
    table.float('kittenX');
    table.float('kittenY');
    table.float('kittenAngle');
    table.float('turretX');
    table.float('turretY');
    table.float('turretAngle');
    table.float('health');
    table.float('healthTextX');
    table.float('healthTextY');
    table.string('direction');
    // table.string('prevDir');
    table.boolean('isActive');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games_users');
};
