const mongoose = require('mongoose');
const { EMAIL_REGEXP } = require("../util/constants");


/**
 * 
 * @param {typeof dependencies} 
 */
const initModel = ({
  mongoose,
  EMAIL_REGEXP,
  String,
  Number,
}) => {
  const schema = new mongoose.Schema({
    email: { type: String, required: true, match: EMAIL_REGEXP },
    amount: { type: Number, required: true },
    auctionId: { type: mongoose.ObjectId, required: true },
  }, { collection: 'bid', timestamps: true });

  return mongoose.model('bid', schema);
};


const dependencies = { mongoose, EMAIL_REGEXP, String, Number };

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initModel(dependencies),
};



