const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Você acessou uma rota protegida!',
    user: req.user,
  });
});

module.exports = router;
