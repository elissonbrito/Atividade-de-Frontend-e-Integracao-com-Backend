const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Fullstack - Veículos & Moda',
      version: '1.0.0',
      description: 'API RESTful com autenticação JWT, MongoDB (carros, motos, marcas de roupa) e PostgreSQL (usuários).',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Servidor local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Carro: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            marca: { type: 'string' },
            modelo: { type: 'string' },
            ano: { type: 'integer' },
            cor: { type: 'string' },
            preco: { type: 'number' },
          },
        },
        Moto: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            marca: { type: 'string' },
            modelo: { type: 'string' },
            ano: { type: 'integer' },
            cilindradas: { type: 'integer' },
            preco: { type: 'number' },
          },
        },
        MarcaRoupa: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nome: { type: 'string' },
            pais: { type: 'string' },
            segmento: { type: 'string' },
            fundacao: { type: 'integer' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
