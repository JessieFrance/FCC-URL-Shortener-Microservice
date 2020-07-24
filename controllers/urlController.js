var Url = require('../models/url');
var async = require('async');

const { check, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator/filter');

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
	} else{
	    // Send information if not found in database.
	    res.json({"error": "No url index found for the given input."});
	}
	
    });
};


/*

Given a new url, (new_url) stored in the request, this function 
creates a new number for the url shorterner api, or displays errors
for invalid url input.

*/
exports.url_create_post = function(req, res, next){

    // Get (possibly) new url.
    let new_url = req.body.new_url;
    
    // TODO: check if valid url.

    // TODO: Standardize format of url for lookup in database.

    // Check if url already exists in db
    Url.findOne( {"url": new_url }, (err, dataEntry) => {
	if (err) return;
	if (dataEntry){
	    res.json({"original_url": new_url, "short_url": dataEntry.urlIndex} );
	} else { // url not found in database
	    
	    // Create a url index.
	    let urlIndex = new Date().getTime();   
  
	    // Create new url mongoDB document.
	    var newUrldB = new Url( { url: new_url, urlIndex: urlIndex} );

	    // Try to save it, or return an error.
	    newUrldB.save(function (err) {
		if (err){
		    return next(err);
		}
		// New url was saved without an error.

		// Give json response with new url index.
		res.json( {"original_url": new_url, "short_url": urlIndex} );
	    });
	}
    });  

    /*
    // Create a url index.
    let urlIndex = new Date().getTime();
    
    
    // Create new url mongoDB document.
    var newUrldB = new Url( { url: new_url, urlIndex: urlIndex} );

    // Try to save it, or return an error.
    newUrldB.save(function (err) {
	if (err){
	    return next(err);
	}
	// New url was saved without an error.
	// Give json response with new url index.
	res.json( {"original_url": new_url, "short_url": urlIndex} );

    });

    */
    /*
    let result = req.body;
    console.log(result);
    let new_url = req.body.new_url;
    console.log(new_url);
    //res.json({'output':'works'});
    res.json({'output': new_url});
    */
	
};




/*[
    //check('name','URL name is required.').isLength([{min: 1}]),
    //sanitizeBody('name').escape(),
    (req, res, next) => {
	res.json({'output new': new_url});
	/*
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	    return res.status(422).json({ errors: errors.array() });
	} else{	
	    res.json({'output new': new_url});
	}

    }
];
*/

/*exports.url_create_post = function(req, res){

    let result = req.body;
    console.log(result);
    let new_url = req.body.new_url;
    console.log(new_url);
    //res.json({'output':'works'});
    res.json({'output': new_url});
};*/
