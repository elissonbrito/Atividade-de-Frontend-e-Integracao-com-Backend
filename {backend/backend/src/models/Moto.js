const mongoose = require('mongoose');

const motoSchema = new mongoose.Schema({
  marca: { type: String, required: true, trim: true, maxlength: 50 },
  modelo: { type: String, required: true, trim: true, maxlength: 100 },
  ano: { type: Number, required: true, min: 1885, max: new Date().getFullYear() + 1 },
  cilindradas: { type: Number, required: true, min: 50, max: 2500 },
  cor: { type: String, required: true, trim: true, maxlength: 30 },
  preco: { type: Number, required: true, min: 0 },
  tipo: {
    type: String,
    enum: ['esportiva', 'naked', 'touring', 'trail', 'custom', 'scooter', 'off-road'],
    default: 'naked',
  },
}, { timestamps: true });

module.exports = mongoose.model('Moto', motoSchema);
