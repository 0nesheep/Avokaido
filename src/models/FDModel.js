const mongoose = require("mongoose");

const submitSchema = new mongoose.Schema({
    userId: { type: String, require: true},
    galleryId: { type: String, require: true, unique: true },
    reactions: { type: Array, default: [] },  
});


const model = mongoose.model("FallenDSubmissions", submitSchema);

module.exports = model;