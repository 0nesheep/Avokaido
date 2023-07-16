const mongoose = require("mongoose");

const achSchema = new mongoose.Schema({
    index: { type: Number, require: true, unique: true},
    name: { type: String, require: true },
    badgePath: { type: String, default: null },
    style: {
        bgTop: {
            imagePath: { type: String, required: false },
            blendingMode: { type: String, required: false},
        },
        bgBot: {
            imagePath: { type: String, required: false },
            blendingMode: { type: String, required: false},
        },
    },
    fg: {
        fgTop: {
            imagePath: { type: String, required: false },
            blendingMode: { type: String, required: false},
        },
        fgBot: {
            imagePath: { type: String, required: false },
            blendingMode: { type: String, required: false},
        },
    },
    special: {
        basePath: { type: String, required: true},
        memoryPath: { type: String, required: false },
        nameColor: { type: String, required: false},
        namePos: { type: Array, required: false},
        barPath: {type: String, required: false},
    }
});


const model = mongoose.model("achievements", achSchema);

module.exports = model;