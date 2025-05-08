const mongoose = require('mongoose');
const id = require('../id');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  ticketId: { type: String, required: true, unique: true }
});
const raffleSchema = new mongoose.Schema({
  id: { type: String, require: true, unique: true },
  title: { type: String, require: true, default: '' },
  price: { type: Number, require: true },
  maxTickets: { type: Number, require: true, default: 0 },
  users: { type: [userSchema], default: [] }
});

const model = mongoose.model('raffles', raffleSchema);

module.exports = model;
