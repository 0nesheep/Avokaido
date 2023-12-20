const mongoose = require("mongoose");

const specSchema = new mongoose.Schema({
    index: { type: Number, require: true, unique: true },
    name: { type: String, require: true },
    background: { type: String, require: true },
    base: { type: String, require: true },
    levelBar: { type: String, require: true },
    decor: { type: Array, default: [] },
    tag: { type: String, require: true },
    nameCol: { type: String, require: true},
    petalCol: { type: String, require: true},
    levelCol: { type: String, require: true},
    nameStyle: { type: String, require: true},
    petalStyle: { type: String, require: true},
    levelStyle: { type: String, require: true},
    nameH: { type: Number, require: true},
    nameW: { type: Number, require: true},
});


const model = mongoose.model("specials", specSchema);

module.exports = model;