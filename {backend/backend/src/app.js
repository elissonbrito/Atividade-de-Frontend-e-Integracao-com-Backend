require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const carroRoutes = require('./routes/carroRoutes');
const motoRoutes = require('./routes/motoRoutes');
const marcaRoupaRoutes = require('./routes/marcaRoupaRoutes');

const app = express();

// ─── Segurança (OWASP Top 10) ─────────────────────────────────────────────────
app.use(helmet());                         // Headers HTTP seguros (A05:Security Misconfiguration)
app.use(mongoSanitize());                  // Prevenção de NoSQL Injection (A03:Injection)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting (A04:Insecure Design / Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200,
  message: { message: 'Muitas requisições, tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
});

app.use(limiter);
app.use(express.json({ limit: '10kb' }));  // Limita tamanho do body (A06)
app.use(express.urlencoded({ extended: false }));

// ─── Swagger ──────────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'API Fullstack - Docs',
}));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/auth', authLimiter, authRoutes);
app.use('/users', userRoutes);
app.use('/carros', carroRoutes);
app.use('/motos', motoRoutes);
app.use('/marcas-roupa', marcaRoupaRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Rota não encontrada' }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor' });
});

module.exports = app;
