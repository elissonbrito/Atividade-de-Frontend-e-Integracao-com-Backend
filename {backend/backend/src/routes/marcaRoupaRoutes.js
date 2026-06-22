const router = require('express').Router();
const MarcaRoupa = require('../models/MarcaRoupa');
const createCrudController = require('../controllers/crudController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

const ctrl = createCrudController(MarcaRoupa, 'MarcaRoupa');

/**
 * @swagger
 * tags:
 *   name: Marcas de Roupa
 *   description: CRUD de marcas de roupa (MongoDB)
 */

/**
 * @swagger
 * /marcas-roupa:
 *   get:
 *     summary: Lista todas as marcas de roupa
 *     tags: [Marcas de Roupa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista paginada de marcas
 */
router.get('/', authenticate, ctrl.getAll);

/**
 * @swagger
 * /marcas-roupa/{id}:
 *   get:
 *     summary: Busca marca por ID
 *     tags: [Marcas de Roupa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados da marca
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarcaRoupa'
 *       404:
 *         description: Marca não encontrada
 */
router.get('/:id', authenticate, ctrl.getById);

/**
 * @swagger
 * /marcas-roupa:
 *   post:
 *     summary: Cadastra nova marca de roupa
 *     tags: [Marcas de Roupa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarcaRoupa'
 *     responses:
 *       201:
 *         description: Marca criada
 */
router.post('/', authenticate, validate(schemas.marcaRoupa), ctrl.create);

/**
 * @swagger
 * /marcas-roupa/{id}:
 *   put:
 *     summary: Atualiza marca de roupa
 *     tags: [Marcas de Roupa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarcaRoupa'
 *     responses:
 *       200:
 *         description: Marca atualizada
 */
router.put('/:id', authenticate, validate(schemas.marcaRoupa), ctrl.update);

/**
 * @swagger
 * /marcas-roupa/{id}:
 *   delete:
 *     summary: Remove marca de roupa
 *     tags: [Marcas de Roupa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Marca removida
 */
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;
