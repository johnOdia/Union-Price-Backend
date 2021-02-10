const express = require("express");
const app = express();
const PORT = process.env.PORT || 5500;
const Joi = require("@hapi/joi");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const request = require("request");
const cors = require('cors')

//Swagger Schema
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Union Price API",
      version: "1.0.0",
      description: "Union Price API information",
      swagger: "2.0",
      contact: {
        name: "John Odia, Eugenia Ikwuegbu",
      },
      servers: ["http://localhost:5500", "http://unionpriceapi.herokuapp.com/"],
    },
  },
  apis: ["app.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

//Middlewares
app.use(cors())
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// app.use("/", validateReqQuery);

//Validate request query with Joi
const schema = Joi.object({
  location: Joi.string().required(),
  houseType: Joi.string().required(),
  bedrooms: Joi.number().integer().min(1).max(9).required(),
  bathrooms: Joi.number().integer().min(1).max(9).required(),
  toilets: Joi.number().integer().min(1).max(9).required(),
});

function validateReqQuery(req, res, next) {
  const { error } = schema.validate(req.query);
  if (error) return res.status(400).send(error.details[0].message);
  else next();
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

//Routes =>

/**
 * @swagger
 *  /estimated-rent:
 *  post:
 *   description: Used to request estimated rent price for a given set of input parameters
 *   parameters:
 *   - name: location
 *     in: body
 *     required: true
 *   - name: houseType
 *     in: body
 *     required: true
 *   - name: bedrooms
 *     in: body
 *     required: true
 *   - name: bathrooms
 *     in: body
 *     required: true
 *   - name: toilets
 *     in: body
 *     required: true
 *   responses:
 *    200:
 *     description: A successful response
 *    400:
 *     description: An invalid request
 */
app.post("/estimated-rent", (req, res, next) => {
  const { location, houseType, bedroom, bathroom, toilet} = req.body

  const options = {
    method: "POST",
    url: "https://rent-pred.herokuapp.com/predict",
    headers: {},
    formData: {
      "house-type": houseType,
      locations: location,
      bedroom: bedroom,
      bathroom: bathroom,
      toilet: toilet,
    },
  };

  request(options, function (error, response) {
    if (error) {
      const err = new Error(error);
      res.status(401).send(err.message)
    }
    res.send(response.body);
  });

});

/**
 * @swagger
 *  /estimated-price:
 *  post:
 *   description: Used to request estimated price for purchasing a house according to a given set of input parameters
 *   parameters:
 *   - name: location
 *     in: body
 *     required: true
 *   - name: houseType
 *     in: body
 *     required: true
 *   - name: bedrooms
 *     in: body
 *     required: true
 *   - name: bathrooms
 *     in: body
 *     required: true
 *   - name: toilets
 *     in: body
 *     required: true
 *   responses:
 *    200:
 *     description: A successful response
 *    400:
 *     description: An invalid request
 */
app.post("/estimated-price", (req, res) => {
  const { location, houseType, bedroom, bathroom, toilet } = req.body

  const options = {
    method: "POST",
    url: "https://sale-prediction.herokuapp.com/predict",
    headers: {},
    formData: {
      "house-type": houseType,
      locations: location,
      bedroom: bedroom,
      bathroom: bathroom,
      toilet: toilet,
    },
  };

  request(options, function (error, response) {
    if (error) {
      const err = new Error(error);
      res.status(401).send(err.message)
    }
    res.send(response.body);
  });
});


app.listen(PORT, () => console.log(`server started on ${PORT}`));
