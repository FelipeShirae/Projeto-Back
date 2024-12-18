const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const installRoutes = require('./routes/install');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas principais
app.get('/', (req, res) => {
  res.send('API REST funcionando!');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno no servidor',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.use('/', installRoutes);

app.use('/auth', authRoutes);