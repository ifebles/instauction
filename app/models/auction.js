const mongoose = require('mongoose');
const { EMAIL_REGEXP, AUCTION_STATUS } = require("../util/constants");


/**
 * 
 * @param {typeof dependencies} 
 */
const initModel = ({
  mongoose,
  EMAIL_REGEXP,
  AUCTION_STATUS,
  String,
  Number,
  Object,
  Date,
}) => {
  const schema = new mongoose.Schema({
    item: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true, match: EMAIL_REGEXP },
    startingPrice: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      default: AUCTION_STATUS.WAITING,
      enum: Object.values(AUCTION_STATUS),
    },
    winningBid: { type: mongoose.ObjectId },
    startTime: { type: Date },
    endTime: { type: Date }
  }, { collection: 'auction', timestamps: true });

  return mongoose.model('auction', schema);
};


const dependencies = { mongoose, EMAIL_REGEXP, AUCTION_STATUS, String, Number, Object, Date };

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initModel(dependencies),
};



