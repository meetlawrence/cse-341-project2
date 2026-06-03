const swaggerAutogen = require('swagger-autogen')();

const host = process.env.NODE_ENV === 'production' ? 'your-production-url.com' : 'localhost:3000';

const schemes = process.env.NODE_ENV === 'production' ? ['https'] : ['http'];

const doc = {
    info: {
        title: 'Personal Expense Tracker API', 
        description: 'API for managing personal expenses'
    },
    host: host,
    schemes: schemes,
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// this will generate the swagger.json file at the root of the project
swaggerAutogen(outputFile, endpointsFiles, doc);