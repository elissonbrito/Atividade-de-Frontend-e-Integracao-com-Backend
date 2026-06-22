const User = require('../models/User');

// GET /users
const getAll = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

// GET /users/:id
const getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

// PUT /users/:id
const update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Somente admin pode alterar role, ou o próprio usuário seus dados
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({ message: 'Sem permissão' });
    }
    if (req.body.role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Somente admin pode alterar role' });
    }

    await user.update(req.body);
    return res.status(200).json(user.toSafeObject());
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

// DELETE /users/:id
const remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    await user.destroy();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

module.exports = { getAll, getById, update, remove };
