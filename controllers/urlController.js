var Url = require('../models/url');
var async = require('async');
var dns = require('dns');


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
    
    // Check if url is even valid.
    if (  !useRegex2CheckURL(new_url) ) {
	res.json({"error": "url input appears invalid"});
	return; // Don't send any more data later on!
    }


    // Perform a dns lookup on the hostname for the url input to
    // see if the url is valid.
    /*
    let lookup = prepUrlForDNSLookup(new_url);
    dns.lookup(lookup, function (err, addresses, family){
	if (err){
	    res.json({"error": "input url does not match a valid hostname"});
	}
    });
    */
    
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


	
};



/---*Helper functions for validating urls---*/


/*

This function uses regex to check if strings match the patterns
of a valid url. It is adapted from 
// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url

*/
function useRegex2CheckURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}


/*
This function prepares an input url string for dns lookup by stripping the http(s)
protocols and possible backslash at the end.

*/
function prepUrlForDNSLookup(str) {

    // If the new url has a backslash on the end, cut it off or dns lookup will
    // return undefined.
    str = (str[str.length -1] === '/') ? ( str.slice(0, -1) ) : (str);

    // Replace http or https before dns lookup as in this example
    // https://stackoverflow.com/questions/53697633/nodejs-dns-lookup-is-rejecting-urls-with-http
    var REPLACE_REGEX = /^https?:\/\//i;
    return str.replace(REPLACE_REGEX, '');

    
}
