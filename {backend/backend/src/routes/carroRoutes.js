const router = require('express').Router();
const Carro = require('../models/Carro');
const createCrudController = require('../controllers/crudController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

const ctrl = createCrudController(Carro, 'Carro');

/**
 * @swagger
 * tags:
 *   name: Carros
 *   description: CRUD de carros (MongoDB)
 */

/**
 * @swagger
 * /carros:
 *   get:
 *     summary: Lista todos os carros
 *     tags: [Carros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista paginada de carros
 */
router.get('/', authenticate, ctrl.getAll);

/**
 * @swagger
 * /carros/{id}:
 *   get:
 *     summary: Busca carro por ID
 *     tags: [Carros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados do carro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carro'
 *       404:
 *         description: Carro não encontrado
 */
router.get('/:id', authenticate, ctrl.getById);

/**
 * @swagger
 * /carros:
 *   post:
 *     summary: Cadastra novo carro
 *     tags: [Carros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Carro'
 *     responses:
 *       201:
 *         description: Carro criado
 */
router.post('/', authenticate, validate(schemas.carro), ctrl.create);

/**
 * @swagger
 * /carros/{id}:
 *   put:
 *     summary: Atualiza carro
 *     tags: [Carros]
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
 *             $ref: '#/components/schemas/Carro'
 *     responses:
 *       200:
 *         description: Carro atualizado
 */
router.put('/:id', authenticate, validate(schemas.carro), ctrl.update);

/**
 * @swagger
 * /carros/{id}:
 *   delete:
 *     summary: Remove carro
 *     tags: [Carros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Carro removido
 */
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;
