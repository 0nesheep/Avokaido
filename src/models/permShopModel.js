const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  id: { type: String, require: true, unique: true },
  link: { type: String, require: true, default: '' },
  price: { type: Number, require: true, default: 0 },
  claimed: { type: Number, require: true, default: 0 },
  claimedUsers: { type: Array, default: [] },
  title: { type: String, default: '' }
});

const model = mongoose.model('permaShop', shopSchema);

module.exports = model;
