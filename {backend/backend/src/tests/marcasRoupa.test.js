require('./setup');
const request = require('supertest');
const mongoose = require('mongoose');
const { sequelize } = require('../config/database');
const app = require('../app');
const MarcaRoupa = require('../models/MarcaRoupa');
const User = require('../models/User');

let server, token, marcaId;

const marcaData = {
  nome: 'Nike', pais: 'Estados Unidos',
  segmento: 'esporte', fundacao: 1964,
  website: 'https://nike.com',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await sequelize.sync({ force: true });
  server = app.listen(0);

  const res = await request(server).post('/auth/register').send({
    name: 'Tester', email: 'marca@test.com', password: 'senha123',
  });
  token = res.body.token;
});

afterAll(async () => {
  await MarcaRoupa.deleteMany({});
  await User.destroy({ where: {} });
  await mongoose.connection.close();
  await sequelize.close();
  server.close();
});

describe('Marcas de Roupa Routes', () => {
  describe('POST /marcas-roupa', () => {
    it('deve criar uma marca com dados válidos', async () => {
      const res = await request(server)
        .post('/marcas-roupa')
        .set('Authorization', `Bearer ${token}`)
        .send(marcaData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.nome).toBe(marcaData.nome);
      marcaId = res.body._id;
    });

    it('deve rejeitar marca com segmento inválido', async () => {
      const res = await request(server)
        .post('/marcas-roupa')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...marcaData, nome: 'Outra', segmento: 'invalido' });
      expect(res.status).toBe(400);
    });

    it('deve rejeitar sem autenticação', async () => {
      const res = await request(server).post('/marcas-roupa').send(marcaData);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /marcas-roupa', () => {
    it('deve listar marcas com paginação', async () => {
      const res = await request(server)
        .get('/marcas-roupa')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /marcas-roupa/:id', () => {
    it('deve buscar marca por ID', async () => {
      const res = await request(server)
        .get(`/marcas-roupa/${marcaId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.nome).toBe(marcaData.nome);
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const res = await request(server)
        .get('/marcas-roupa/000000000000000000000000')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /marcas-roupa/:id', () => {
    it('deve atualizar uma marca', async () => {
      const res = await request(server)
        .put(`/marcas-roupa/${marcaId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...marcaData, pais: 'EUA' });
      expect(res.status).toBe(200);
      expect(res.body.pais).toBe('EUA');
    });
  });

  describe('DELETE /marcas-roupa/:id', () => {
    it('deve remover uma marca', async () => {
      const res = await request(server)
        .delete(`/marcas-roupa/${marcaId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(204);
    });

    it('deve retornar 404 ao remover marca inexistente', async () => {
      const res = await request(server)
        .delete('/marcas-roupa/000000000000000000000000')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
