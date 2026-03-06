const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth.routes');
const bancadaRoutes = require('./routes/bancada.routes');
const securityRoutes = require('./routes/security.routes');
const governanceRoutes = require('./routes/governance.routes');
const infraRoutes = require('./routes/infra.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const usersRoutes = require('./routes/users.routes');
const { checkAll } = require('./services/serverService');

const app = express();

checkAll();

setInterval(async () => {
  await checkAll();
}, 30000);

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bancada', bancadaRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/infra', infraRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', usersRoutes);

// Servir arquivos estáticos do Frontend
const frontendPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Rota curinga para SPA
app.get('/{*path}', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    return res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        res.status(404).send('Frontend não encontrado. Certifique-se de rodar npm run build no frontend.');
      }
    });
  }

  return res.status(404).json({ message: 'Rota não encontrada' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;