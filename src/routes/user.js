const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const usersFile = path.join(__dirname, '../database/users.json');

router.post('/users', authMiddleware, async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Apenas administradores podem criar usuários.' });
  }

  fs.readFile(usersFile, 'utf8', async (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
    }

    const users = JSON.parse(data);

    if (users.some((u) => u.username === username)) {
      return res.status(409).json({ error: 'Usuário já existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, password: hashedPassword, role });

    fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar o usuário.' });
      }
      res.json({ message: 'Usuário criado com sucesso!' });
    });
  });
});

module.exports = router;
