const mongoose = require("mongoose");

const submitSchema = new mongoose.Schema({
    userId: { type: String, require: true},
    galleryId: { type: String, require: true, unique: true },
    reactions: { type: Array, default: [] },  
    attackedId: { type: String, require: true},
});


const model = mongoose.model("ArtFight24Submissions", submitSchema);

module.exports = model;