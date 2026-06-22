require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const { sequelize } = require('../config/database');
const app = require('../app');
const Carro = require('../models/Carro');
const User = require('../models/User');

let server, token, carroId;

const carroData = {
  marca: 'Toyota', modelo: 'Corolla', ano: 2022,
  cor: 'Prata', preco: 120000, combustivel: 'flex',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await sequelize.sync({ force: true });
  server = app.listen(0);

  const res = await request(server).post('/auth/register').send({
    name: 'Tester', email: 'carro@test.com', password: 'senha123',
  });
  token = res.body.token;
});

afterAll(async () => {
  await Carro.deleteMany({});
  await User.destroy({ where: {} });
  await mongoose.connection.close();
  await sequelize.close();
  server.close();
});

describe('Carros Routes', () => {
  describe('POST /carros', () => {
    it('deve criar um carro com dados válidos', async () => {
      const res = await request(server)
        .post('/carros')
        .set('Authorization', `Bearer ${token}`)
        .send(carroData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.marca).toBe(carroData.marca);
      carroId = res.body._id;
    });

    it('deve rejeitar carro sem campos obrigatórios', async () => {
      const res = await request(server)
        .post('/carros')
        .set('Authorization', `Bearer ${token}`)
        .send({ marca: 'Fiat' });
      expect(res.status).toBe(400);
    });

    it('deve rejeitar sem autenticação', async () => {
      const res = await request(server).post('/carros').send(carroData);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /carros', () => {
    it('deve listar carros com paginação', async () => {
      const res = await request(server)
        .get('/carros')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /carros/:id', () => {
    it('deve buscar carro por ID', async () => {
      const res = await request(server)
        .get(`/carros/${carroId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(carroId);
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const res = await request(server)
        .get('/carros/000000000000000000000000')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it('deve retornar 400 para ID inválido', async () => {
      const res = await request(server)
        .get('/carros/id_invalido')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /carros/:id', () => {
    it('deve atualizar um carro', async () => {
      const res = await request(server)
        .put(`/carros/${carroId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...carroData, cor: 'Branco' });
      expect(res.status).toBe(200);
      expect(res.body.cor).toBe('Branco');
    });
  });

  describe('DELETE /carros/:id', () => {
    it('deve remover um carro', async () => {
      const res = await request(server)
        .delete(`/carros/${carroId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(204);
    });

    it('deve retornar 404 ao tentar remover carro inexistente', async () => {
      const res = await request(server)
        .delete('/carros/000000000000000000000000')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
