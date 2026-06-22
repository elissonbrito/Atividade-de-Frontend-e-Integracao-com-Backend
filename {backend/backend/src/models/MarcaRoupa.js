const mongoose = require('mongoose');

const marcaRoupaSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true, maxlength: 100, unique: true },
  pais: { type: String, required: true, trim: true, maxlength: 60 },
  segmento: {
    type: String,
    required: true,
    enum: ['luxo', 'esporte', 'casual', 'streetwear', 'moda-praia', 'plus-size', 'infantil'],
  },
  fundacao: { type: Number, required: true, min: 1800, max: new Date().getFullYear() },
  website: { type: String, trim: true, maxlength: 200 },
  ativa: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('MarcaRoupa', marcaRoupaSchema);
