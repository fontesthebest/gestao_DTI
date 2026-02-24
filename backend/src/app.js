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

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Desabilita o CSP restrito para permitir o funcionamento no navegador
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
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

// Rota curinga para SPA (deve vir por último)
app.get('*', (req, res) => {
  // Se não for uma rota de API ou Uploads, envia o index.html
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        res.status(404).send('Frontend não encontrado. Certifique-se de rodar npm run build no frontend.');
      }
    });
  }
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
