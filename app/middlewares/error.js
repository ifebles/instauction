const { debugOut } = require("../util/utilityMethods");


/**
 * 
 * @param {typeof dependencies} 
 */
const initAdapter = ({
  debugOut,
  Date,
}) => async (ctx, next) => {
  try {
    await next();
  }
  catch (ex) {
    if (!ex.status)
      debugOut({
        ns: 'app:error',
        msg: 'Unexpected exception occurred: %o',
        type: console.error,
      }, ex);
    else
      debugOut({
        ns: 'app:error',
        msg: ex,
      });

    ctx.status = ex.status || 500;
    ctx.body = {
      Meta: {
        status: ctx.message,
        now: Date.now(),
        requestId: ctx.state._requestID,
      },
      Result: null,
    };
  }
};


const dependencies = { debugOut, Date };

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initAdapter(dependencies),
};



