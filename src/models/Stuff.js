const { DataTypes } = require('sequelize');
const db = require('../db');

const Stuff = db.define('Stuff', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM,
    values: ['admin', 'teacher', 'assistent_teacher', 'super_admin']
  },
  username: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(300),
    allowNull: false
  }
}, {
  tableName: 'stuff',
  timestamps: false
});

module.exports = Stuff;