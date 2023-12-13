var express = require('express');
var app = express();
//const https = require('https');
const https = require('http');
var fs = require('fs');
var path = require('path');

app.disable('x-powered-by')

const allowedMethods = ['GET', 'POST']
app.use((req, res, next) => {
    if (!allowedMethods.includes(req.method))
        return res.status(405).send('Method Not Allowed')

    return next()
})

// Serve static assets
app.use(express.static(path.resolve(__dirname, '.', 'dist')));

// Always return the main index.html, so react-router render the route in the client

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '.', 'dist', 'index.html'));
});

//https.createServer(option, app).listen(10010, function() {
//  console.log("HTTPS server listening on port " + 7010);
//})
https.createServer(app).listen(10021, function() {
    console.log('Start Payssam Order on port 10021')
});
