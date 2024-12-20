const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const categoriesFile = path.join(__dirname, '../database/categories.json');

//Rota para criar uma nova categoria
router.post('/categories', authMiddleware, (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Nome e descrição são obrigatórios.' });
  }

  fs.readFile(categoriesFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
    }

    const categories = JSON.parse(data);
    const newCategory = { id: Date.now(), name, description };
    categories.push(newCategory);

 
    fs.writeFile(categoriesFile, JSON.stringify(categories, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar a categoria.' });
      }
      res.status(201).json({ message: 'Categoria criada com sucesso!', category: newCategory });
    });
  });
});
//Rota para listar todas as categorias
router.get('/categories', (req, res) => {
  fs.readFile(categoriesFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
    }

    const categories = JSON.parse(data);
    res.json({ categories });
  });
});


router.put('/categories/:id', authMiddleware, (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  if (!name || !description) {
    return res.status(400).json({ error: 'Nome e descrição são obrigatórios.' });
  }

  //Ler as categorias
  fs.readFile(categoriesFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
    }

    const categories = JSON.parse(data);
    const categoryIndex = categories.findIndex((c) => c.id === Number(id));

    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    //Atualizar a categoria
    const updatedCategory = { id: Number(id), name, description };
    categories[categoryIndex] = updatedCategory;

    
    fs.writeFile(categoriesFile, JSON.stringify(categories, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar a categoria.' });
      }
      res.json({ message: 'Categoria atualizada com sucesso!', category: updatedCategory });
    });
  });
});

// Rota para excluir uma categoria
router.delete('/categories/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  // Ler as categorias
  fs.readFile(categoriesFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
    }

    let categories = JSON.parse(data);
    const categoryIndex = categories.findIndex((c) => c.id === Number(id));

    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }


     //Excluir a categoria
    categories = categories.filter((c) => c.id !== Number(id));

    //Salvar as alterações no arquivo
    fs.writeFile(categoriesFile, JSON.stringify(categories, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao excluir a categoria.' });
      }
      res.json({ message: 'Categoria excluída com sucesso!' });
    });
  });
});

module.exports = router;
