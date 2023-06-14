/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('groups_students', (table) => {
    table.increments('id').primary();
    table.integer('student_id').references('id').inTable('students').onDelete('CASCADE').notNullable();
    table.integer('group_id').references('id').inTable('groups').onDelete('CASCADE').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('groups_students');
};
