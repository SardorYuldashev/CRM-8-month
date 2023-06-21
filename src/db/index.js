const { Sequelize } = require('sequelize');
const config = require('../shared/config');

module.exports = new Sequelize({
    dialect: 'postgres',
    database: config.db.name,
    username: config.db.user,
    port: config.db.port,
    password:config.db.password
  });