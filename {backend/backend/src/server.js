require('dotenv').config();
const app = require('./app');
const { connectMongo, connectPostgres } = require('./config/database');
const seedUsers = require('./config/seed');

const PORT = process.env.PORT || 3001;

const start = async () => {
  await connectMongo();
  await connectPostgres();
  await seedUsers();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 Swagger disponível em http://localhost:${PORT}/api-docs`);
  });
};

start();