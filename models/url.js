var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  url: { type: String, required: true },
  urlIndex: { type: Number, required: true }
});

// Export model.
module.exports = mongoose.model('Url', UrlSchema);
