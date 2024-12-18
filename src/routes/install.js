const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const router = express.Router();
const path = require('path');

const usersFile = path.join(__dirname, '../database/users.json');

router.get('/install', async (req, res) => {
  const adminUser = {
    username: process.env.ADMIN_USER,
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    role: 'admin',
  };

  fs.writeFile(usersFile, JSON.stringify([adminUser], null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Falha ao criar usuário administrador.' });
    }
    res.json({ message: 'Usuário administrador criado com sucesso!' });
  });
});

module.exports = router;
