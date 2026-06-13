require('dotenv').config();
const { Sequelize } = require('sequelize');

const isSqlite = process.env.DB_DIALECT === 'sqlite';

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: { require: true, rejectUnauthorized: false }
      } : {}
    })
  : new Sequelize({
      dialect: isSqlite ? 'sqlite' : 'postgres',
      storage: isSqlite ? './database.sqlite' : undefined,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'fitness_point',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

module.exports = sequelize;
