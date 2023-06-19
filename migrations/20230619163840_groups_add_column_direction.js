/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('groups', (table) => {
    table.integer('direction_id').references('id').inTable('directions').onDelete('SET NULL');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('groups', (table) => {
    table.dropColumn('direction_id');
  })
};
