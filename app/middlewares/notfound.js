const { RequestError } = require("../util/utilityMethods");


/**
 * 
 * @param {typeof dependencies} 
 */
const initAdapter = ({ RequestError }) => async (ctx, next) => {
  if (!ctx._matchedRoute)
    throw new RequestError('Endpoint not found', 404);

  await next();
};


const dependencies = { RequestError };

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initAdapter(dependencies),
};



