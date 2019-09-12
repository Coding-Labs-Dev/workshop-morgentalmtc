const express = require('express');
const Controller = require('./Controllers/Controller');

const routes = express.Router();

routes.post('/subscribe', Controller.subscribe);
routes.get('/getSession', Controller.getSession);
routes.post('/transaction', Controller.transaction);

module.exports = routes;
