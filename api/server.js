const express = require('express');

const BudgetRouter = require('../budget/budget-router');

const db = require('../data/dbConfig.js');

const server = express();

server.use('/api/accounts', BudgetRouter);

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({ api: 'up' });
});

module.exports = server;
