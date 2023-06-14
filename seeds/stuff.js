const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('stuff').del()
  await knex('stuff').insert([
    {first_name: 'Sardor',
    last_name: 'Yuldashev',
    role: "super_admin",
    username: 'sardor',
    password: await bcrypt.hash('12345678', 10)
    },
    {first_name: 'Imron',
    last_name: 'Abdusalimov',
    role: "admin",
    username: 'imron',
    password: await bcrypt.hash('123456', 10)
    },
    {first_name: 'Orzu',
    last_name: 'Mirzayev',
    role: "teacher",
    username: 'mirzayev',
    password: await bcrypt.hash('123456', 10)
    },
    {first_name: 'Quvonch',
    last_name: 'Muysinov',
    role: "assistent_teacher",
    username: 'quvonch',
    password: await bcrypt.hash('123456', 10)
    },
    {first_name: 'Alisher',
    last_name: 'Egamberdiyev',
    role: "teacher",
    username: 'alisher',
    password: await bcrypt.hash('123456', 10)
    },
    {first_name: 'Bekzod',
    last_name: 'Nosirov',
    role: "assistent_teacher",
    username: 'bekzod',
    password: await bcrypt.hash('123456', 10)
    },
  ]);
};
