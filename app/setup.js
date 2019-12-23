const Koa = require("koa");
const mongoose = require("mongoose");
const debug = require("debug");
const { debugOut } = require("./util/utilityMethods");
const { SERVER_CONFIG, setTestConfigGlobals } = require("./util/constants");
const middlewaresInit = require("./middlewares");

const auctionModelInit = require("./models/auction");
const bidModelInit = require("./models/bid");

const auctionAdapterInit = require("./adapters/auction");
const bidAdapterInit = require("./adapters/bid");

const auctionServiceInit = require("./services/auction");
const bidServiceInit = require("./services/bid");

const auctionRoutesInit = require("./routes/auction");
const bidRoutesInit = require("./routes/bid");


/**
 * 
 * @param {typeof dependencies} 
 */
const initAdapter = ({
  Koa,
  debug,
  auctionModelInit,
  bidModelInit,
  auctionAdapterInit,
  bidAdapterInit,
  auctionServiceInit,
  bidServiceInit,
  auctionRoutesInit,
  bidRoutesInit,
  mongoose,
  debugOut,
  SERVER_CONFIG,
  setTestConfigGlobals,
  middlewaresInit,
}) => {

  ///////////////// DECLARATIONS /////////////////

  const app = new Koa();

  ///////////////// MODELS /////////////////

  const models = {
    auctionModel: auctionModelInit.make(auctionModelInit.dependencies),
    bidModel: bidModelInit.make(bidModelInit.dependencies),
  };

  ///////////////// ADAPTERS /////////////////

  const adapters = {};
  {
    const adaptersInit = {
      auctionAdapter: auctionAdapterInit.make(auctionAdapterInit.dependencies),
      bidAdapter: bidAdapterInit.make(bidAdapterInit.dependencies),
    };

    for (const a in adaptersInit)
      adapters[a] = adaptersInit[a](models);
  }

  ///////////////// SERVICES /////////////////

  const services = {};
  {
    const servicesInit = {
      auctionService: auctionServiceInit.make(auctionServiceInit.dependencies),
      bidService: bidServiceInit.make(bidServiceInit.dependencies),
    };

    for (const a in servicesInit)
      services[a] = servicesInit[a](adapters);
  }

  ///////////////// PRE-MIDDLEWARE /////////////////

  const middlewares = middlewaresInit.make(middlewaresInit.dependencies);

  for (const a of middlewares.preRequest)
    app.use(a);

  ///////////////// ROUTES /////////////////

  [
    auctionRoutesInit,
    bidRoutesInit,
  ].forEach(f => f.make(f.dependencies)({ app, services }));

  ///////////////// POST-MIDDLEWARE /////////////////

  for (const a of middlewares.postRequest)
    app.use(a);

  /////////////////

  const setDatabaseConnection = async uri => {
    if (!uri)
      throw new Error('Invalid database URI');

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    debugOut({
      msg: 'Database ready',
    });
  };

  return {
    app,
    db: mongoose,
    setDatabaseConnection,
    startServer: async ({ port = null, dbURI = null, isTest = false } = {}) => {
      if (isTest)
        setTestConfigGlobals({ port, dbURI });

      if (SERVER_CONFIG.isDebugEnvEmpty)
        debug.enable('app:*');

      await setDatabaseConnection(SERVER_CONFIG.DB_URI);

      app.listen(SERVER_CONFIG.SERVER_PORT, '0.0.0.0');

      debugOut({ msg: '[%s] Server running on %o' }, new Date().toUTCString(), `http://localhost:${SERVER_CONFIG.SERVER_PORT}`);
      debugOut({ msg: 'Environment: %o' }, SERVER_CONFIG.SERVER_ENV);
    },
  };
};



const dependencies = {
  Koa,
  debug,
  auctionModelInit,
  bidModelInit,
  auctionAdapterInit,
  bidAdapterInit,
  auctionServiceInit,
  bidServiceInit,
  auctionRoutesInit,
  bidRoutesInit,
  mongoose,
  debugOut,
  SERVER_CONFIG,
  setTestConfigGlobals,
  middlewaresInit,
};

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initAdapter(dependencies),
};
