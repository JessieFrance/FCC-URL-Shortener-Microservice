var Url = require('../models/url');
var async = require('async');

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


/*

Given a new url, (new_url) stored in the request, this function 
creates a new number for the url shorterner api, or displays errors
for invalid url input.

*/
exports.url_create_post = function(req, res){

    let result = req.body;
    console.log(result);
    let new_url = req.body.new_url;
    console.log(new_url);
    //res.json({'output':'works'});
    res.json({'output': new_url});
};
