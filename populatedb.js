/*
This script populates the mongodb database with some url entries and indices.
It is adapted from: https://github.com/mdn/express-locallibrary-tutorial/blob/master/populatedb.js
*/

// Load async package and models.
var async = require('async');
var Url = require('./models/url');

// Load uri key.
require('dotenv').config()
var uri =  process.env.MONGODB_URI;

// Connect with mongoose.
var mongoose = require('mongoose');
mongoose.connect(uri, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Initialize empty array of urls.
var urls = [];


/* 
  Description: Given a valid url and url index, this function creates a new url
  in the database.

  Arguments: userUrl  -- valid url from user
             urlIndex -- urlIndex
             cb       -- callback function 
*/
function urlCreate(userUrl, urlIndex, cb) {

    // Create new url mongoDB document.
    var newUrl = new Url( { url: userUrl, urlIndex: urlIndex} );

    // Try to save it, or return an error.
    newUrl.save(function (err) {
	if (err) {
	    cb(err, null)
	    return
	}
	
	console.log('New Url: ' + newUrl);
	urls.push(newUrl)
	cb(null, newUrl)
    });

}

// This function creates a few urls.
function createUrls(cb) {
    async.series([
	function(callback) {
	    urlCreate('https://www.freecodecamp.com/', '1', callback);
	},
	function(callback) {
	    urlCreate('https://nodejs.org/', '2', callback);
	},
	function(callback) {
	    urlCreate('https://www.github.com/', '3', callback);
	},
	function(callback) {
	    urlCreate("https://www.nba.com/", '4', callback);
	},
    ],
     // optional callback
     cb);
}




async.series([
    createUrls
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('URLS: '+ urls);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

