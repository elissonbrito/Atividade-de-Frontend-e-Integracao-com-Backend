const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

// POST /auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'E-mail já cadastrado' });
    }

    const user = await User.create({ name, email, password, role: role || 'user' });
    const token = generateToken(user);

    return res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = generateToken(user);
    return res.status(200).json({ token, user: user.toSafeObject() });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

// GET /auth/me
const me = async (req, res) => {
  return res.status(200).json({ user: req.user.toSafeObject() });
};

module.exports = { register, login, me };
