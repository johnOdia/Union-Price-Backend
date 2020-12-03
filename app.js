const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;
const Joi = require('@hapi/joi')
const predictPrice = require('./model/model')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

//Swagger Schema
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Union Price API", 
            version: "3.0.3",
            description: "Union Price API information",
            swagger: "2.0",
            contact: {
                name: "John Odia, Eugenia Ikwuegbu"
            },
            servers: ["http://localhost:5500", "http://unionpriceapi.herokuapp.com/"]
        }
    },
    apis: ["app.js"]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

//Middlewares
app.use(express.json())
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/',validateReqQuery)


//Validate request query with Joi
const schema = Joi.object({
    location: Joi.string().required(),
    houseType: Joi.string().required(),
    bedrooms:  Joi.number().integer().min(1).max(5).required(),
    bathrooms: Joi.number().integer().min(1).max(5).required(),
    toilets:  Joi.number().integer().min(1).max(5).required()
});

function validateReqQuery(req,res,next){
    const { error } = schema.validate(req.query)
    if(error) return res.status(400).send(error.details[0].message)
    else next()
}

//Routes =>

/**
 * @swagger
 *  /estimated-rent:
 *  get: 
 *   description: Used to request estimated rent price for a given set of input parameters
 *   parameters:
 *   - name: location
 *     in: query
 *     required: true
 *   - name: houseType
 *     in: query
 *     required: true
 *   - name: bedrooms
 *     in: query
 *     required: true
 *   - name: bathrooms
 *     in: query
 *     required: true
 *   - name: toilets
 *     in: query
 *     required: true
 *   responses:
 *    200:
 *     description: A successful response
 *    400:
 *     description: An invalid request
 */
app.get("/estimated-rent", (req, res) => {
    console.log(req.query);
    
    const { location, houseType, bedrooms, bathrooms, toilets } = req.body
    try {
        const randomPrice = predictPrice(location,houseType,bedrooms,bathrooms,toilets)
        res.status(200).json({"estimated-rent":randomPrice});
    } catch (error) {
        res.status(400).send('invalid request')
    }
})


/**
 * @swagger
 *  /estimated-price:
 *  get: 
 *   description: Used to request estimated rent price for a given set of input parameters
 *   parameters:
 *   - name: location
 *     in: query
 *     required: true
 *   - name: houseType
 *     in: query
 *     required: true
 *   - name: bedrooms
 *     in: query
 *     required: true
 *   - name: bathrooms
 *     in: query
 *     required: true
 *   - name: toilets
 *     in: query
 *     required: true
 *   responses:
 *    200:
 *     description: A successful response
 *    400:
 *     description: An invalid request
 */
app.get('/estimated-price', (req, res) => {
    const { location, houseType, bedrooms, bathrooms, toilets } = req.body
    try {
        const randomCost = predictPrice(location,houseType,bedrooms,bathrooms,toilets)
        res.status(200).json([{"estimated-price": randomCost}])
    } catch (error) {
        res.status(400).send('invalid request')
    }
})

app.listen(PORT, () => console.log(`server started on ${PORT}`));