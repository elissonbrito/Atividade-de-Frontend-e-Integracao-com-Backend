require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const { sequelize } = require('../config/database');
const app = require('../app');
const User = require('../models/User');

let server, adminToken, userToken, adminId, userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await sequelize.sync({ force: true });
  server = app.listen(0);

  // Criar admin
  const adminRes = await request(server).post('/auth/register').send({
    name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'admin',
  });
  adminToken = adminRes.body.token;
  adminId = adminRes.body.user.id;

  // Criar user comum
  const userRes = await request(server).post('/auth/register').send({
    name: 'User', email: 'user@test.com', password: 'user123',
  });
  userToken = userRes.body.token;
  userId = userRes.body.user.id;
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await mongoose.connection.close();
  await sequelize.close();
  server.close();
});

describe('User Routes', () => {
  describe('GET /users', () => {
    it('admin deve listar todos os usuários', async () => {
      const res = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('user comum não deve listar todos', async () => {
      const res = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });

    it('deve rejeitar sem autenticação', async () => {
      const res = await request(server).get('/users');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /users/:id', () => {
    it('deve buscar usuário por ID', async () => {
      const res = await request(server)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', userId);
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const res = await request(server)
        .get('/users/99999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /users/:id', () => {
    it('deve atualizar nome do usuário', async () => {
      const res = await request(server)
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Nome Atualizado' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Nome Atualizado');
    });

    it('deve rejeitar atualização com dados inválidos', async () => {
      const res = await request(server)
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'invalido' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('admin deve remover usuário', async () => {
      // Criar usuário para deletar
      const newUser = await request(server).post('/auth/register').send({
        name: 'Para Deletar', email: 'deletar@test.com', password: 'senha123',
      });
      const res = await request(server)
        .delete(`/users/${newUser.body.user.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(204);
    });

    it('user comum não deve remover outros usuários', async () => {
      const res = await request(server)
        .delete(`/users/${adminId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
  });
});
