var mongoose = require("mongoose");

//create schema object
var Schema = mongoose.Schema;

//Article schema
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        reg: "Note"
    }
});

//create Article model
var Article = mongoose.model("Article", ArticleSchema);

//export
module.exports = Article;