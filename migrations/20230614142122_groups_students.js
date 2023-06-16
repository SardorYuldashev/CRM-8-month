/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('groups_students', (table) => {
    table.increments('id').primary();
    table.integer('group_id').references('id').inTable('groups').onDelete('CASCADE');
    table.integer('student_id').references('id').inTable('students').onDelete('CASCADE');
    table.date('joined_at').defaultTo(knex.fn.now());
    table.unique(['student_id', 'group_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('groups_students');
};
