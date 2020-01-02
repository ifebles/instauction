


let _initializedGlobals = false;
const _serverPort = '3100';
const devEnv = 'dev';

const initializeGlobals = () => {
  const dbCredentials = process.env.DB_USER ? `${process.env.DB_USER}${process.env.DB_PASS ? `:${process.env.DB_PASS}` : ''}@` : '';

  global.__serverEnvironment = process.env.NODE_ENV || devEnv;
  global.__serverPort = process.env.PORT || _serverPort;
  global.__serverConnectionString = process.env.DATABASE_URL || `mongodb://${dbCredentials}${process.env.DB_SERVER || 'mongo'}:${process.env.DB_PORT || 27017}/instauction`;
  global.__serverDebug = process.env.DEBUG || (global.__serverEnvironment === devEnv ? 'app:*' : '');
  global.__serverAuctionIdleTimeMs = /^\d+$/.test(process.env.AUCTION_IDLE_TIME_LIMIT_MS) ? +process.env.AUCTION_IDLE_TIME_LIMIT_MS : 10000;

  _initializedGlobals = true;
}

const setTestConfigGlobals = ({ port, dbURI } = {}) => {
  global.__serverEnvironment = 'test';
  global.__serverPort = port || process.env.PORT || _serverPort;
  global.__serverConnectionString = dbURI || '';
  global.__serverDebug = process.env.DEBUG || '';
  global.__serverAuctionIdleTimeMs = /^\d+$/.test(process.env.AUCTION_IDLE_TIME_LIMIT_MS) ? +process.env.AUCTION_IDLE_TIME_LIMIT_MS : 10000;

  _initializedGlobals = true;
}

module.exports = {
  get EMAIL_REGEXP() {
    return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  },
  get DOCUMENT_ID_REGEXP() {
    return /^[a-f0-9]{24}$/;
  },
  get AUCTION_STATUS() {
    return {
      WAITING: 'waiting',
      ONGOING: 'ongoing',
      FINISHED: 'finished',
    };
  },
  get AUCTION_IDLE_TIME_LIMIT_MS() {
    return global.__serverAuctionIdleTimeMs;
  },
  get SERVER_CONFIG() {
    if (!_initializedGlobals)
      initializeGlobals();

    return {
      get SERVER_ENV() {
        return global.__serverEnvironment;
      },
      get SERVER_PORT() {
        return global.__serverPort;
      },
      get DB_URI() {
        return global.__serverConnectionString;
      },
      get DEBUG() {
        return global.__serverDebug;
      },
      get isDebugEnvEmpty() {
        return !process.env.DEBUG;
      },
    };
  },
  setTestConfigGlobals,
  setNormalConfigGlobals: initializeGlobals,
};