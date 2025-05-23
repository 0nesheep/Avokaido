const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: String, require: true, unique: true },
  serverId: { type: String, require: true },
  nickname: { type: String, default: null },
  petals: { type: Number, default: 10 },
  dream: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  memories: { type: Number, default: 0 },
  transferred: { type: Boolean, default: false },
  ach: { type: Array, default: [true] },
  card: {
    activeAch: { type: Array, default: [] },
    decor: { type: Number, default: 0 },
    fg: { type: Number, default: 0 },
    special: { type: Number, default: 0 },
    specDec: { type: Number, default: -1 }
  }
});

const model = mongoose.model('users', profileSchema);

module.exports = model;
