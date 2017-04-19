/**
 * Module dependencies.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

//load route
var crons = require('./server/controller/crons');

//configuring express
app.use(bodyParser.json({
    extended: true
}));

//controllers
app.post('/calculate-crons', crons.crons);

app.listen(4300, function() {
    console.log("Server is running on port 4300");
});

module.exports = app;
