var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
    identificationProfileId:String,
    name:String,
    enrolled:Boolean
});

module.exports = mongoose.model('Profiles', profileSchema);