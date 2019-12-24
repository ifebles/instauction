const { AUCTION_STATUS, AUCTION_IDLE_TIME_LIMIT_MS } = require("../util/constants");
const { RequestError, debugOut, auctionStopperModel, hookActionsDebugger } = require("../util/utilityMethods");
const validatorInit = require("../util/validator");


/**
 * 
 * @param {typeof dependencies} 
 */
const initService = ({
  AUCTION_STATUS,
  AUCTION_IDLE_TIME_LIMIT_MS,
  RequestError,
  debugOut,
  auctionStopperModel,
  hookActionsDebugger,
  validatorInit,
}) => ({ bidAdapter, auctionAdapter }) => {

  const validate = validatorInit.make(validatorInit.dependencies);
  const hookActions = hookActionsDebugger(debugOut);

  return {
    createBid: async ({ ctx, payload, auctionService }) => {
      validate(ctx).bidCreationPayload(payload);

      const validAuction = await auctionAdapter.findOne({
        _id: payload.auctionId,
        status: AUCTION_STATUS.ONGOING,
      }, hookActions(ctx));

      if (!validAuction)
        throw new RequestError("Invalid auction specified", 400);

      if (validAuction.winningBid) {
        const currentWinner = await bidAdapter.findOne({
          _id: validAuction.winningBid,
        }, hookActions(ctx));

        if (currentWinner.amount >= payload.amount)
          throw new RequestError("Bid amount too low", 400);
      }
      else if (payload.amount <= validAuction.startingPrice)
        throw new RequestError("Bid amount too low", 400);

      const result = await bidAdapter.create(payload, hookActions(ctx));
      await auctionAdapter.updateById(payload.auctionId, { winningBid: result._id }, hookActions(ctx))

      {
        const auctionStopper = auctionStopperModel({ auctionAdapter, debugOut })(ctx, payload.auctionId, `${result._id}`, auctionService.endAuction, 'new bid');
        setTimeout(auctionStopper, AUCTION_IDLE_TIME_LIMIT_MS);
      }

      return result;
    },
    showBid: async ({ ctx, id }) => {
      if (id) {
        const result = await bidAdapter.findById(id, hookActions(ctx));
        return result;
      }

      const result = await bidAdapter.find({}, hookActions(ctx));
      return result;
    },
  };
};


const dependencies = {
  AUCTION_STATUS,
  AUCTION_IDLE_TIME_LIMIT_MS,
  RequestError,
  debugOut,
  auctionStopperModel,
  hookActionsDebugger,
  validatorInit,
};

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initService(dependencies),
};



