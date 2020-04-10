const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let EntryModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongoID
const convertId = mongoose.Types.ObjectId;
const setValue = (val) => _.escape(val).trim();

const EntrySchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    trim: true,
    required: true,
    set: setValue,
  },
  item: {
    type: String,
    trim: true,
    required: true,
    set: setValue,
  },
  amount: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Profile',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

EntrySchema.statics.toAPI = (doc) => ({
  year: doc.year,
  month: doc.month,
  category: doc.category,
  item: doc.item,
  amount: doc.amount,
});

EntrySchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return EntryModel.find(search).select('year month category item amount').exec(callback);
};

EntrySchema.statics.removeEntry = (doc, callback) => {
  const query = {
    owner: convertId(doc.owner),
    year: doc.year,
    month: doc.month,
    category: doc.category,
    item: doc.item,
  };

  EntryModel.find(query).remove().exec();

  return EntrySchema.statics.findByOwner(doc.owner, callback);
};

EntryModel = mongoose.model('Entry', EntrySchema);

module.exports.EntryModel = EntryModel;
module.exports.EntrySchema = EntrySchema;
