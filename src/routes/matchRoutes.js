const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

module.exports = (io) => {
  router.get('/:id', matchController.getMatch);
  router.put('/:id/score', (req, res) => matchController.updateScore(req, res, io));
  return router;
};