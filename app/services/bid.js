const { AUCTION_STATUS, AUCTION_IDLE_TIME_LIMIT_MS } = require("../util/constants");
const { RequestError, debugOut, auctionStopperModel, hookActionsDebugger, paginationParser } = require("../util/utilityMethods");
const validatorInit = require("../util/validator");


const bidMapper = obj => ({
  id: obj._id,
  email: obj.email,
  amount: obj.amount,
  auctionId: obj.auctionId,
  date: obj.createdAt,
});


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
  bidMapper,
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

      return bidMapper(result);
    },
    showBid: async ({ ctx, id, pagination = null }) => {
      if (id) {
        const result = await bidAdapter.findById(id, hookActions(ctx));

        if (!result)
          throw new RequestError("Bid not found", 404);

        return bidMapper(result);
      }

      const processedPagination = paginationParser(validate(ctx), pagination);
      if (processedPagination.zeroDisplay)
        return [];

      const result = await bidAdapter.find({}, processedPagination.result, hookActions(ctx));
      return result.map(bidMapper);
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
  bidMapper,
};

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initService(dependencies),
};



