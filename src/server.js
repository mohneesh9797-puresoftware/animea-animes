const express = require('express');
const app = express();
const animeRoute = require('./routes/anime');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const expressSwagger = require('express-swagger-generator')(app);
const cors = require('cors');

// CORS
app.use(cors());

// Swagger configuration
const options = {
  swaggerDefinition: {
    info: {
      description: 'This is a sample server',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/v1',
    produces: [
      'application/json',
      'application/xml',
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
  },
  basedir: __dirname, // app absolute path
  files: ['./routes/*.js'], // Path to the API handle folder
};
expressSwagger(options);


app.use(bodyParser.json());

dotenv.config();


// Middleware to show logs of every call
app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
  next();
});
app.use(animeRoute);
app.use(express.static('public'));

// Handler for 404 - Resource not found
app.use((req, res, next) => {
  res.status(404).send('We think you are lost!');
});

// Handler for error 500
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.sendFile(path.join(__dirname, '../public/500.html'));
});

module.exports = app;
