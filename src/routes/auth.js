const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const usersFile = path.join(__dirname, '../database/users.json');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password são obrigatórios.' });
  }

// Ler o arquivo
  fs.readFile(usersFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
    }

    const users = JSON.parse(data);
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    //Comparar a senhaa
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const token = jwt.sign({ username: user.username, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

      res.json({ message: 'Login bem-sucedido!', token });
    });
  });
});

module.exports = router;
