
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('players').del(),
    knex('games').del(),
    knex('games_users').del(),

    // Inserts seed entries
    knex('players').insert({id: 1, username: 'test', email: 'test@fake.net', password: 'test', wins: 0, losses: 0, win_loss_ratio: 0})
  );
};
