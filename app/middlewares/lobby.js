const uuid = require("uuid");

/**
 * 
 * @param {typeof dependencies} 
 */
const initAdapter = () => async (ctx, next) => {
  ctx.type = 'application/json';
  ctx.state._requestID = uuid();
  ctx.state._startDate = Date.now();

  await next();
};


const dependencies = {};

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initAdapter(dependencies),
};



