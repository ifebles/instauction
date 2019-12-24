const { AUCTION_STATUS, AUCTION_IDLE_TIME_LIMIT_MS } = require("../util/constants");
const { RequestError, debugOut, auctionStopperModel, hookActionsDebugger, paginationParser } = require("../util/utilityMethods");
const validatorInit = require("../util/validator");


const auctionMapper = obj => ({
  id: obj._id,
  item: obj.item,
  description: obj.description,
  startingPrice: obj.startingPrice,
  winningBid: obj.winningBid || null,
  startTime: obj.startTime || null,
  endTime: obj.endTime || null,
  status: obj.status,
});

const auctionStatusMapper = obj => ({
  id: obj._id,
  status: obj.status,
  startTime: obj.startTime,
  endTime: obj.endTime,
});


/**
 * 
 * @param {typeof dependencies} 
 */
const initService = ({
  auctionMapper,
  auctionStatusMapper,
  Date,
  AUCTION_STATUS,
  AUCTION_IDLE_TIME_LIMIT_MS,
  validatorInit,
  RequestError,
  debugOut,
  auctionStopperModel,
  hookActionsDebugger,
}) => ({ auctionAdapter, bidAdapter }) => {

  const validate = validatorInit.make(validatorInit.dependencies);
  const hookActions = hookActionsDebugger(debugOut);

  return {
    createAuction: async ({ ctx, payload }) => {
      validate(ctx).auctionCreationPayload(payload);

      const result = await auctionAdapter.create(payload, hookActions(ctx));

      return auctionMapper(result);
    },
    async startAuction({ ctx, id }) {
      const currentDate = new Date();
      const startTime = currentDate.toISOString();
      currentDate.setMilliseconds(currentDate.getMilliseconds() + AUCTION_IDLE_TIME_LIMIT_MS);
      const endTime = currentDate.toISOString();

      const result = await auctionAdapter.updateOne({ _id: id, status: AUCTION_STATUS.WAITING }, {
        startTime,
        status: AUCTION_STATUS.ONGOING,
        endTime,
      }, hookActions(ctx));

      if (!result)
        throw new RequestError('Unable to start auction: none found with the specified requirements', 400);

      {
        const auctionStopper = auctionStopperModel({ auctionAdapter, debugOut })(ctx, id, `${result.winningBid}`, this.endAuction, 'auction started');
        setTimeout(auctionStopper, AUCTION_IDLE_TIME_LIMIT_MS);
      }

      return auctionMapper(result);
    },
    async endAuction({ ctx, id }) {
      const currentDate = new Date().toISOString();

      const result = await auctionAdapter.updateOne({ _id: id, status: AUCTION_STATUS.ONGOING }, {
        endTime: currentDate,
        status: AUCTION_STATUS.FINISHED,
      }, hookActions(ctx));

      if (!result)
        throw new RequestError('Unable to end auction: none found with the specified requirements', 400);

      return auctionMapper(result);
    },
    showAuction: async ({ ctx, id, pagination = null }) => {
      if (id) {
        const result = await auctionAdapter.findById(id, hookActions(ctx));
        return auctionMapper(result);
      }

      const processedPagination = paginationParser(validate(ctx), pagination);
      if (processedPagination.zeroDisplay)
        return [];

      const result = await auctionAdapter.find({}, processedPagination.result, hookActions(ctx));
      return result.map(auctionMapper);
    },
    showAuctionBids: async ({ ctx, id }) => {
      const result = await bidAdapter.find({ auctionId: id }, hookActions(ctx));

      return result;
    },
    auctionStatus: async ({ ctx, id, pagination = null }) => {
      if (id) {
        const result = await auctionAdapter.findById(id, hookActions(ctx));
        return auctionStatusMapper(result);
      }

      const processedPagination = paginationParser(validate(ctx), pagination);
      if (processedPagination.zeroDisplay)
        return [];

      const result = await auctionAdapter.find({}, processedPagination.result, hookActions(ctx));
      return result.map(auctionStatusMapper);
    },
  };
};


const dependencies = {
  auctionMapper,
  auctionStatusMapper,
  Date,
  AUCTION_STATUS,
  AUCTION_IDLE_TIME_LIMIT_MS,
  validatorInit,
  RequestError,
  debugOut,
  auctionStopperModel,
  hookActionsDebugger,
};

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initService(dependencies),
};



