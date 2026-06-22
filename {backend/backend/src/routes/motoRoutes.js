const router = require('express').Router();
const Moto = require('../models/Moto');
const createCrudController = require('../controllers/crudController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

const ctrl = createCrudController(Moto, 'Moto');

/**
 * @swagger
 * tags:
 *   name: Motos
 *   description: CRUD de motos (MongoDB)
 */

/**
 * @swagger
 * /motos:
 *   get:
 *     summary: Lista todas as motos
 *     tags: [Motos]
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
 *         description: Lista paginada de motos
 */
router.get('/', authenticate, ctrl.getAll);

/**
 * @swagger
 * /motos/{id}:
 *   get:
 *     summary: Busca moto por ID
 *     tags: [Motos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados da moto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Moto'
 *       404:
 *         description: Moto não encontrada
 */
router.get('/:id', authenticate, ctrl.getById);

/**
 * @swagger
 * /motos:
 *   post:
 *     summary: Cadastra nova moto
 *     tags: [Motos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Moto'
 *     responses:
 *       201:
 *         description: Moto criada
 */
router.post('/', authenticate, validate(schemas.moto), ctrl.create);

/**
 * @swagger
 * /motos/{id}:
 *   put:
 *     summary: Atualiza moto
 *     tags: [Motos]
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
 *             $ref: '#/components/schemas/Moto'
 *     responses:
 *       200:
 *         description: Moto atualizada
 */
router.put('/:id', authenticate, validate(schemas.moto), ctrl.update);

/**
 * @swagger
 * /motos/{id}:
 *   delete:
 *     summary: Remove moto
 *     tags: [Motos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Moto removida
 */
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;
