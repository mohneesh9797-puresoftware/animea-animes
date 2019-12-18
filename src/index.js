const express = require('express');

const app = express();
const animeRoute = require('./routes/anime');
const path = require('path');
const bodyParser = require('body-parser');
const database = require('../db');
const dotenv = require('dotenv');
const expressSwagger = require('express-swagger-generator')(app);

// Swagger configuration
let options = {
  swaggerDefinition: {
      info: {
          description: 'This is a sample server',
          title: 'Swagger',
          version: '1.0.0',
      },
      host: 'localhost:3000',
      basePath: '/v1',
      produces: [
          "application/json",
          "application/xml"
      ],
      schemes: ['http', 'https'],
      securityDefinitions: {
          JWT: {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
              description: "",
          }
      }
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/*.js'] //Path to the API handle folder
};
expressSwagger(options)
// Database connection
database.connect();

app.use(bodyParser.json());

dotenv.config();


// Middleware to show logs of every call
app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
  next();
});

// This includes person routes
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.info(`Server has started on port ${PORT}`));
