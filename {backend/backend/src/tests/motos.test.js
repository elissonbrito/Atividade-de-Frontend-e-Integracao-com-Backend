require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const { sequelize } = require('../config/database');
const app = require('../app');
const Moto = require('../models/Moto');
const User = require('../models/User');

let server, token, motoId;

const motoData = {
  marca: 'Honda', modelo: 'CB 500F', ano: 2023,
  cilindradas: 500, cor: 'Vermelha', preco: 35000, tipo: 'naked',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await sequelize.sync({ force: true });
  server = app.listen(0);

  const res = await request(server).post('/auth/register').send({
    name: 'Tester', email: 'moto@test.com', password: 'senha123',
  });
  token = res.body.token;
});

afterAll(async () => {
  await Moto.deleteMany({});
  await User.destroy({ where: {} });
  await mongoose.connection.close();
  await sequelize.close();
  server.close();
});

describe('Motos Routes', () => {
  describe('POST /motos', () => {
    it('deve criar uma moto com dados válidos', async () => {
      const res = await request(server)
        .post('/motos')
        .set('Authorization', `Bearer ${token}`)
        .send(motoData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.marca).toBe(motoData.marca);
      motoId = res.body._id;
    });

    it('deve rejeitar moto sem campos obrigatórios', async () => {
      const res = await request(server)
        .post('/motos')
        .set('Authorization', `Bearer ${token}`)
        .send({ marca: 'Yamaha' });
      expect(res.status).toBe(400);
    });

    it('deve rejeitar sem autenticação', async () => {
      const res = await request(server).post('/motos').send(motoData);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /motos', () => {
    it('deve listar motos com paginação', async () => {
      const res = await request(server)
        .get('/motos')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /motos/:id', () => {
    it('deve buscar moto por ID', async () => {
      const res = await request(server)
        .get(`/motos/${motoId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(motoId);
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const res = await request(server)
        .get('/motos/000000000000000000000000')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /motos/:id', () => {
    it('deve atualizar uma moto', async () => {
      const res = await request(server)
        .put(`/motos/${motoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...motoData, cor: 'Azul' });
      expect(res.status).toBe(200);
      expect(res.body.cor).toBe('Azul');
    });
  });

  describe('DELETE /motos/:id', () => {
    it('deve remover uma moto', async () => {
      const res = await request(server)
        .delete(`/motos/${motoId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(204);
    });
  });
});
