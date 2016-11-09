///<reference path="./typings/index.d.ts" />
"use strict";
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var firebase = require('firebase');
var Application = (function () {
    function Application(env) {
        if (env === void 0) { env = 'dev'; }
        this.address = { port: 0, host: null };
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.env = env;
        firebase.initializeApp({
            apiKey: "AIzaSyBhjW3PcfxEYck414qc2Dy9bZH-dXVI51g",
    authDomain: "pythonproject-3bbe8.firebaseapp.com",
    databaseURL: "https://pythonproject-3bbe8.firebaseio.com",
    storageBucket: "pythonproject-3bbe8.appspot.com",
    messagingSenderId: "379028927056"
        });

        
    }
    Application.prototype.enviroment = function () {
        
        if (this.env === 'dev') {
        }
        else if (this.env === 'prod') {
        }
    };
    Application.prototype.setPort = function (port) {
        if (port === void 0) { port = 3000; }
        this.address.port = process.env.PORT || port;
    };
    Application.prototype.bodyParser = function () {
        // this.app.use(bodyParser.urlencoded({limit: '1mb', extended: true, parameterLimit: 10000})); // parse application/x-www-form-urlencoded (to support URL-encoded bodies)
        this.app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); // Using bodyparser for getting post request variables (to support application/JSON-encoded bodies)
    };
    Application.prototype.customLogger = function () {
        //logger middle ware
        this.app.use(function (req, res, next) {
            console.log('Logging: ' + req.method.toString() + ': ' + req.url.toString());
            next();
        });
    };
    Application.prototype.errorHandler = function () {
        /// catch 404 and forwarding to error handler
        this.app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        if (this.env === 'dev') {
            // development error handler will print stacktrace
            this.app.use(function (err, req, res, next) {
                res.status(err.status || 500).send({
                    message: err.message,
                    error: err
                });
            });
        }
        else {
            // production error handler no stacktraces leaked to user
            this.app.use(function (err, req, res, next) {
                res.status(err.status || 500).send({
                    message: err.message,
                    error: {}
                });
            });
        }
    };
    Application.prototype.indexRoute = function () {
        /* GET home page. */
        this.app.get('/', this.renderIndex);
        this.app.get('/api/getdata', this.getDataFromFirebase);
        this.app.post('/api/postdata', this.postDataFromFirebase);
    };
    Application.prototype.renderIndex = function (req, res) {
        res.status(200).send('Hellow World from Express');
    };
    Application.prototype.getDataFromFirebase = function (req, res) {
 
        firebase.database().ref('/').child('test2').once('value', function (snapshot) {
            res.status(200).send('Firebase API: ' + snapshot.val());
        });
    };
    Application.prototype.postDataFromFirebase = function (req, res) {
        // method1
        // firebase.database().ref('/').child('test2').push(req.body).then((err) => {
        //     res.status(200).send('Firebase API: ' + err);
        // });
        // method2
        var ref = firebase.database().ref('/').child('test2').push();
        console.log('key: ', ref.key);
        ref.update(req.body).then(function (err) {
            res.status(200).send('Firebase API: ' + err);
        });
    };
    Application.prototype.allowOrigin = function () {
        this.app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', "true");
            // Pass to next layer of middleware
            next();
        });
    };
    Application.prototype.startServerListing = function () {
        var _this = this;
        this.httpServer.listen(this.address.port, function (r) {
            // this.address = this.httpServer.address();
            _this.address.port = _this.httpServer.address().port;
            _this.address.host = _this.httpServer.address().address;
            console.log('server is running on http://localhost:' + _this.address.port + '/');
        });
    };
    Application.prototype.startServer = function () {
        this.enviroment();
        this.setPort();
        this.customLogger();
        this.bodyParser();
        this.allowOrigin();
        this.indexRoute();
        this.errorHandler();
        this.startServerListing();
    };
    return Application;
}());
exports.Application = Application;
var app = new Application();
app.startServer();



       firebase.database().ref('/').child('test2').on('child_added', function(snapshot){
    console.log(snapshot.val(), snapshot.key);

})