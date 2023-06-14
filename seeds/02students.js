/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('students').del()
  await knex('students').insert([
    {first_name: 'Sherzod', last_name: 'Arziyev'},
    {first_name: 'Aziz', last_name: 'Nabiyev'},
    {first_name: 'Bunyod', last_name: 'Jo\'rayev'},
    {first_name: 'Begzod', last_name: 'To\'ychiyev'},
    {first_name: 'Oybek', last_name: 'Xasanov'},
    {first_name: 'O\'ral', last_name: 'Xasanov'},
    {first_name: 'Javohir', last_name: 'Umaraliyev'},
    {first_name: 'Barat', last_name: 'Xusanov'},
  ]);
};
