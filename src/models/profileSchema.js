const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true},
    serverId: { type: String, require: true },
    nickname: { type: String, default: null },
    petals: { type: Number, default: 10 },
    dream: { type: Number, default: 0 },
    memories: { type: Number, default: 0},
});

const model = mongoose.model("users", profileSchema);

module.exports = model;