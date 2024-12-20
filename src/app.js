const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const installRoutes = require('./routes/install');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const caregoryRoutes = require('./routes/categories');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.send('API REST funcionando!');
});

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

app.use('/', protectedRoutes);

app.use('/', userRoutes);

app.use('/', productRoutes);

app.use('/', caregoryRoutes);