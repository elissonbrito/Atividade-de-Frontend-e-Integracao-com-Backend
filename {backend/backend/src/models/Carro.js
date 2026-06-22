const mongoose = require('mongoose');

const carroSchema = new mongoose.Schema({
  marca: { type: String, required: true, trim: true, maxlength: 50 },
  modelo: { type: String, required: true, trim: true, maxlength: 100 },
  ano: { type: Number, required: true, min: 1886, max: new Date().getFullYear() + 1 },
  cor: { type: String, required: true, trim: true, maxlength: 30 },
  preco: { type: Number, required: true, min: 0 },
  combustivel: {
    type: String,
    enum: ['gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido'],
    default: 'flex',
  },
  quilometragem: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Carro', carroSchema);
