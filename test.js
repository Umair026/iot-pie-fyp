///<reference path="./typings/index.d.ts" />
"use strict";
var firebase = require('firebase');
        firebase.initializeApp({
            apiKey: "AIzaSyBhjW3PcfxEYck414qc2Dy9bZH-dXVI51g",
    authDomain: "pythonproject-3bbe8.firebaseapp.com",
    databaseURL: "https://pythonproject-3bbe8.firebaseio.com",
    storageBucket: "pythonproject-3bbe8.appspot.com",
    messagingSenderId: "379028927056"
        });

       firebase.database().ref('/').child('test2').on('child_added', function(snapshot){
    console.log(snapshot.val(), snapshot.key);

})