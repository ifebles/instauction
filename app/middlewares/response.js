

/**
 * 
 * @param {typeof dependencies} 
 */
const initAdapter = ({ Date }) => async (ctx, next) => {
  ctx.body = {
    Meta: {
      status: ctx.message,
      now: Date.now(),
      requestId: ctx.state._requestID,
    },
    Result: ctx.body === undefined ? null : ctx.body,
  };

  await next();
};


const dependencies = { Date };

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initAdapter(dependencies),
};



