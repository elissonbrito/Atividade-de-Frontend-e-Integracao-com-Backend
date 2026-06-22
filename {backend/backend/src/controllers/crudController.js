/**
 * Factory de CRUD para modelos Mongoose.
 * Evita repetição de código para Carro, Moto e MarcaRoupa.
 */
const createCrudController = (Model, resourceName) => ({
  // GET /resource
  getAll: async (req, res) => {
    try {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        Model.find().skip(skip).limit(limit).lean(),
        Model.countDocuments(),
      ]);

      return res.status(200).json({ data: items, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
      return res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  },

  // GET /resource/:id
  getById: async (req, res) => {
    try {
      const item = await Model.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ message: `${resourceName} não encontrado` });
      return res.status(200).json(item);
    } catch (err) {
      if (err.name === 'CastError') return res.status(400).json({ message: 'ID inválido' });
      return res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  },

  // POST /resource
  create: async (req, res) => {
    try {
      const item = await Model.create(req.body);
      return res.status(201).json(item);
    } catch (err) {
      if (err.code === 11000) return res.status(409).json({ message: 'Registro duplicado' });
      return res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  },

  // PUT /resource/:id
  update: async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ message: `${resourceName} não encontrado` });
      return res.status(200).json(item);
    } catch (err) {
      if (err.name === 'CastError') return res.status(400).json({ message: 'ID inválido' });
      return res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  },

  // DELETE /resource/:id
  remove: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: `${resourceName} não encontrado` });
      return res.status(204).send();
    } catch (err) {
      if (err.name === 'CastError') return res.status(400).json({ message: 'ID inválido' });
      return res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  },
});

module.exports = createCrudController;
