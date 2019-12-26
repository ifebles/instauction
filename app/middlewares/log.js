const { debugOut } = require("../util/utilityMethods");



/**
 * 
 * @param {typeof dependencies} 
 */
const initAdapter = ({
  debugOut,
  Date,
  Array,
  JSON,
}) => async (ctx, next) => {
  debugOut({
    ns: 'app:req',
    msg: '[%s] %s %s',
    ctx,
  }, new Date().toString(), ctx.request.method, ctx.request.url);

  debugOut({
    ns: 'app:req:header',
    msg: ctx.request.headers,
    ctx,
  });

  await next();

  const timeDifference = Date.now() - ctx.state._startDate;
  const jsonOutput = { ...ctx.body };
  ctx.body = JSON.stringify(ctx.body);
  let jsonResult;

  debugOut({
    ns: 'app:resp',
    msg: '%s %s (%o ms) | %o %db',
    ctx,
  },
    ctx.request.method,
    ctx.request.url,
    timeDifference,
    ctx.status,
    ctx.body.length,
  );

  try {
    if (Array.isArray(jsonOutput.Result)) {
      const tempArrayContent = JSON.stringify(jsonOutput.Result);

      if (tempArrayContent.length > 100)
        jsonOutput.Result = ['...'];
    }
    else {
      for (const a in jsonOutput.Result)
        if (Array.isArray(jsonOutput.Result[a])) {
          const tempArrayContent = JSON.stringify(jsonOutput.Result[a]);

          if (tempArrayContent.length > 100)
            jsonOutput.Result = ['...'];
        }
    }

    jsonResult = jsonOutput
  }
  catch (ex) {
    jsonResult = jsonOutput
  }

  debugOut({
    ns: 'app:resp:header',
    msg: { ...ctx.response.headers },
    ctx,
  });

  debugOut({
    ns: 'app:resp:json',
    msg: jsonResult,
    ctx,
  });
};


const dependencies = { debugOut, Date, Array, JSON };

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initAdapter(dependencies),
};



