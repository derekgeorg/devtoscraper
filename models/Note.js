var mongoose = require("mongoose");

//Schema constructor
var Schema = mongoose.Schema;

//create schema for note
var NoteSchema = new Schema({
    title: String,
    body: String,
});

//create Note model
var Note = mongoose.model("Note", NoteSchema);

//export
module.exports = Note;