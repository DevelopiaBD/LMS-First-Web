const mongoose = require("mongoose")

const trushSchema = new mongoose.Schema({
  lecturesVideos:[{type:String}]
});


const trush  = mongoose.model('trush', trushSchema);
module.exports = trush;

