const express = require('express');
const app = express();
const mysql = require('mysql2');


var bodyParser = require('body-parser');

let router = require('./app/router.js');

const cors = require('cors')

app.use(cors());

app.use(bodyParser.json());
app.use(express.static('resources'));
app.use('/', router);

// Create a Server
const server = app.listen(5000, function () {

    let host = server.address().address
    let port = server.address().port

    console.log("App listening at http://%s:%s", host, port);
})
