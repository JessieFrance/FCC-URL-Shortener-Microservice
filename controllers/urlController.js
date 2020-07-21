var Url = require('../models/url');
var async = require('async');

exports.test_controller = function(req, res){
    res.send('The controller is working.');
};

/*

Given a url number (urlNumber) stored in the request, this function
tries to redirect to the webpage in the database matching that number.

*/
exports.match_url_number = function(req, res){
    // Unpack url variable.
    var urlNumber = req.params.urlNumber;

    // TODO: Make sure valid number.
    
    // Find where the urlNumber variable from the user matches
    // the urlIndex key in the database.
    Url.findOne( { "urlIndex": urlNumber}, (err, dataEntry) => {
	if (err) return;
	if (dataEntry){
	    res.redirect(dataEntry.url);
	}
	// TODO: Send information if not found in database.
    });
};
