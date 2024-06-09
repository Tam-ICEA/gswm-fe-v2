const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  SchoolName: { type: String, required: true },
  SchoolID: { type: String, required: true },
  BranchID: { type: String, required: true },
  AdminEmail: { type: String, required: true },
  date: { type: Date, required: true },

}, {
  timestamps: true,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;