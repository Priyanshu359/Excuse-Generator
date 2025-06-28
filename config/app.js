const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('../src/routes');
const errorHandler = require('../middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
// This code sets up an Express application with CORS, JSON parsing, and logging middleware.
// It also imports and uses the routes defined in the 'routes' module and applies a custom error handler.
