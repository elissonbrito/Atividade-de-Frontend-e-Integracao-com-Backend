const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

// ─── MongoDB (NoSQL) ───────────────────────────────────────────────────────────
const connectMongo = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/api_db';
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Erro ao conectar MongoDB:', err.message);
    process.exit(1);
  }
};

// ─── PostgreSQL (SQL) ──────────────────────────────────────────────────────────
const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'api_users',
  process.env.POSTGRES_USER || 'pguser',
  process.env.POSTGRES_PASSWORD || 'pgpassword',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  }
);

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL conectado');
    await sequelize.sync({ alter: true });
    console.log('✅ Tabelas sincronizadas');
  } catch (err) {
    console.error('❌ Erro ao conectar PostgreSQL:', err.message);
    process.exit(1);
  }
};

module.exports = { connectMongo, connectPostgres, sequelize };
