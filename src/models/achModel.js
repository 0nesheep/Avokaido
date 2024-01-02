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
    base: { type: String, default: null },
});


const model = mongoose.model("achievements", achSchema);

module.exports = model;