const router = require('express').Router();
const { register, login, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Registro, login e perfil
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra novo usuário
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "João Silva" }
 *               email: { type: string, example: "joao@email.com" }
 *               password: { type: string, example: "senha123" }
 *               role: { type: string, enum: [user, admin], example: "user" }
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       409:
 *         description: E-mail já cadastrado
 */
router.post('/register', validate(schemas.register), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "joao@email.com" }
 *               password: { type: string, example: "senha123" }
 *     responses:
 *       200:
 *         description: Login realizado, retorna token JWT
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', validate(schemas.login), login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna dados do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Não autenticado
 */
router.get('/me', authenticate, me);

module.exports = router;
