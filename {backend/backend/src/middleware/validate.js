const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ message: 'Dados inválidos', errors: messages });
  }
  next();
};

// ─── Schemas ──────────────────────────────────────────────────────────────────

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    role: Joi.string().valid('user', 'admin').optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateUser: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).max(100).optional(),
    role: Joi.string().valid('user', 'admin').optional(),
  }).min(1),

  carro: Joi.object({
    marca: Joi.string().max(50).required(),
    modelo: Joi.string().max(100).required(),
    ano: Joi.number().integer().min(1886).max(new Date().getFullYear() + 1).required(),
    cor: Joi.string().max(30).required(),
    preco: Joi.number().min(0).required(),
    combustivel: Joi.string().valid('gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido').optional(),
    quilometragem: Joi.number().min(0).optional(),
  }),

  moto: Joi.object({
    marca: Joi.string().max(50).required(),
    modelo: Joi.string().max(100).required(),
    ano: Joi.number().integer().min(1885).max(new Date().getFullYear() + 1).required(),
    cilindradas: Joi.number().integer().min(50).max(2500).required(),
    cor: Joi.string().max(30).required(),
    preco: Joi.number().min(0).required(),
    tipo: Joi.string().valid('esportiva', 'naked', 'touring', 'trail', 'custom', 'scooter', 'off-road').optional(),
  }),

  marcaRoupa: Joi.object({
    nome: Joi.string().max(100).required(),
    pais: Joi.string().max(60).required(),
    segmento: Joi.string().valid('luxo', 'esporte', 'casual', 'streetwear', 'moda-praia', 'plus-size', 'infantil').required(),
    fundacao: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
    website: Joi.string().uri().max(200).optional().allow(''),
    ativa: Joi.boolean().optional(),
  }),
};

module.exports = { validate, schemas };
