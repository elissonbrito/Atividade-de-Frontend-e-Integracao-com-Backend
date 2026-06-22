require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const { sequelize } = require('../config/database');
const app = require('../app');
const User = require('../models/User');

let server;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await sequelize.sync({ force: true });
  server = app.listen(0);
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await mongoose.connection.close();
  await sequelize.close();
  server.close();
});

beforeEach(async () => {
  await User.destroy({ where: {} });
});

describe('Auth Routes', () => {
  const userData = { name: 'Teste User', email: 'teste@email.com', password: 'senha123' };

  describe('POST /auth/register', () => {
    it('deve registrar um novo usuário e retornar token', async () => {
      const res = await request(server).post('/auth/register').send(userData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', userData.email);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('deve rejeitar e-mail duplicado', async () => {
      await request(server).post('/auth/register').send(userData);
      const res = await request(server).post('/auth/register').send(userData);
      expect(res.status).toBe(409);
    });

    it('deve rejeitar dados inválidos', async () => {
      const res = await request(server).post('/auth/register').send({ email: 'invalido' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(server).post('/auth/register').send(userData);
    });

    it('deve fazer login com credenciais válidas', async () => {
      const res = await request(server).post('/auth/login').send({
        email: userData.email,
        password: userData.password,
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('deve rejeitar senha incorreta', async () => {
      const res = await request(server).post('/auth/login').send({
        email: userData.email,
        password: 'errada',
      });
      expect(res.status).toBe(401);
    });

    it('deve rejeitar e-mail inexistente', async () => {
      const res = await request(server).post('/auth/login').send({
        email: 'naoexiste@email.com',
        password: 'qualquer',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /auth/me', () => {
    let token;

    beforeEach(async () => {
      const res = await request(server).post('/auth/register').send(userData);
      token = res.body.token;
    });

    it('deve retornar dados do usuário autenticado', async () => {
      const res = await request(server)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('email', userData.email);
    });

    it('deve rejeitar requisição sem token', async () => {
      const res = await request(server).get('/auth/me');
      expect(res.status).toBe(401);
    });

    it('deve rejeitar token inválido', async () => {
      const res = await request(server)
        .get('/auth/me')
        .set('Authorization', 'Bearer token_invalido');
      expect(res.status).toBe(401);
    });
  });
});
