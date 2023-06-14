/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('groups').del()
  await knex('groups').insert([
    {
      name: "N82",
      teacher_id: 3,
      assistent_teacher_id: 4
    },
    {
      name: "N93",
      teacher_id: 5,
      assistent_teacher_id: 6
    },
  ]);
};
