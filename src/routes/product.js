const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const productsFile = path.join(__dirname, '../database/products.json');

// Rota para criar um novo produto
router.post('/products', authMiddleware, (req, res) => {
  const { name, description, price, categoryId } = req.body;

  if (!name || !description || !price || !categoryId) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Ler os produtos existentes
  fs.readFile(productsFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
    }

    const products = JSON.parse(data);
    const newProduct = { id: Date.now(), name, description, price, categoryId };
    products.push(newProduct);

    // Salvar o novo produto no arquivo
    fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar o produto.' });
      }
      res.status(201).json({ message: 'Produto criado com sucesso!', product: newProduct });
    });
  });
});

//Rpta para listar todos os produtos com paginação
router.get('/products', (req, res) => {
  const { limit = 5, page = 1 } = req.query;

  if (![5, 10, 30].includes(Number(limit))) {
    return res.status(400).json({ error: 'Limite deve ser 5, 10 ou 30.' });
  }

  // Ler os produto
  fs.readFile(productsFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
    }

    const products = JSON.parse(data);

//Paginacao
    const paginatedProducts = products.slice((page - 1) * limit, page * limit);

    res.json({
      page,
      limit,
      total: products.length,
      products: paginatedProducts,
    });
  });
});

// Rota para atualizar um produto
router.put('/products/:id', authMiddleware, (req, res) => {
  const { name, description, price, categoryId } = req.body;
  const { id } = req.params;

  if (!name || !description || !price || !categoryId) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Ler os produtos
  fs.readFile(productsFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
    }

    const products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === Number(id));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // Atualizar o produto
    const updatedProduct = { id: Number(id), name, description, price, categoryId };
    products[productIndex] = updatedProduct;

    // Salvar as alterações no arquivo
    fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar o produto.' });
      }
      res.json({ message: 'Produto atualizado com sucesso!', product: updatedProduct });
    });
  });
});

// Rota para excluir um produto
router.delete('/products/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  // Ler os produtos
  fs.readFile(productsFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === Number(id));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // Excluir o producto
    products = products.filter((p) => p.id !== Number(id));

    //Salvar as alteraçães
    fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao excluir o produto.' });
      }
      res.json({ message: 'Produto excluído com sucesso!' });
    });
  });
});

module.exports = router;
