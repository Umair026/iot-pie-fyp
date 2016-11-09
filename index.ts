///<reference path="./typings/index.d.ts" />

"use strict";

import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as firebase from 'firebase';

export class Application {
    private app;
    private httpServer: http.Server;
    private address: { port: number, host: string } = { port: 0, host: null };
    private env: string; // enviroment 'dev' || 'prod' 
    private mongoDbConStr: string;
     
    constructor(env: string = 'dev') {
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.env = env;
        

        firebase.initializeApp({
            apiKey: "AIzaSyCGEGQbVDfJAuLtxIqdLNdLvscRGt9re2A",
            authDomain: "devhyphen.firebaseapp.com",
            databaseURL: "https://devhyphen.firebaseio.com",
            storageBucket: "devhyphen.appspot.com",
        });
    }

    private enviroment() {
        if (this.env === 'dev') {
        } else if (this.env === 'prod') {
        }
    }

    public setPort(port: number = 3000) {
        this.address.port = process.env.PORT || port;
    }

    private bodyParser() {
        // this.app.use(bodyParser.urlencoded({limit: '1mb', extended: true, parameterLimit: 10000})); // parse application/x-www-form-urlencoded (to support URL-encoded bodies)
        this.app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
        this.app.use(bodyParser.json({ limit: '1mb' }));	// Using bodyparser for getting post request variables (to support application/JSON-encoded bodies)
    }

    private customLogger() {
        //logger middle ware
        this.app.use((req, res, next) => {
            console.log('Logging: ' + req.method.toString() + ': ' + req.url.toString());
            next();
        });
    }

    private errorHandler() {
        /// catch 404 and forwarding to error handler
        this.app.use((req, res, next) => {
            var err: any = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        if (this.env === 'dev') {
            // development error handler will print stacktrace
            this.app.use((err, req, res, next) => {
                res.status(err.status || 500).send({
                    message: err.message,
                    error: err
                });
            });
        } else {
            // production error handler no stacktraces leaked to user
            this.app.use((err, req, res, next) => {
                res.status(err.status || 500).send({
                    message: err.message,
                    error: {}
                });
            });
        }
    }

    public indexRoute() {
        /* GET home page. */
        this.app.get('/', this.renderIndex);
        this.app.get('/api/getdata', this.getDataFromFirebase);
        this.app.post('/api/postdata', this.postDataFromFirebase);
    }

    private renderIndex(req: express.Request, res: express.Response) {
        res.status(200).send('Hellow World from Express');
    }

    private getDataFromFirebase(req: express.Request, res: express.Response) {
        firebase.database().ref('/').child('test2').once('value', (snapshot) => {
            res.status(200).send('Firebase API: ' + snapshot.val());
        });
        
    }
    private postDataFromFirebase(req: express.Request, res: express.Response) {
        // method1
        // firebase.database().ref('/').child('test2').push(req.body).then((err) => {
        //     res.status(200).send('Firebase API: ' + err);
        // });

        // method2
        let ref = firebase.database().ref('/').child('test2').push()
        console.log('key: ', ref.key);
        ref.update(req.body).then((err) => {
            res.status(200).send('Firebase API: ' + err);
        });
        
    }

    private allowOrigin() {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {

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
    }

    private startServerListing() {
        this.httpServer.listen(this.address.port, (r) => {
            // this.address = this.httpServer.address();
            this.address.port = this.httpServer.address().port;
            this.address.host = this.httpServer.address().address;
            console.log('server is running on http://localhost:' + this.address.port + '/');
        });
    }

    public startServer() {
        this.enviroment();
        this.setPort();
        this.customLogger();
        this.bodyParser();
        this.allowOrigin();
        this.indexRoute();
        this.errorHandler();
        this.startServerListing();
    }


}


let app: Application = new Application();
app.startServer();
