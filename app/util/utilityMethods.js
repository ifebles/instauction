const debug = require("debug");
const { SERVER_CONFIG } = require("../util/constants");


module.exports = {
  RequestError: class extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  },
  debugOut({ ns = 'app:server', msg = '', ctx, type = console.log, show = true, testOutput = false }, ...args) {
    if (!show || (!testOutput && SERVER_CONFIG.SERVER_ENV === 'test'))
      return;

    const myDebug = debug(ns);
    myDebug.log = type.bind(console);

    const message = (ctx ? `${ctx.state._requestID.match(/^\w+/)[0]} | ` : '') + (typeof msg === 'string' ? msg : '%o');
    const myArgs = typeof msg === 'string' ? args : [msg, ...args];

    myDebug(message, ...myArgs);
  },
  hookActionsDebugger: debugOut => ctx => ({
    preAction: obj => {
      for (const a in obj)
        debugOut({
          ns: `app:db:${a}`,
          msg: obj[a],
          ctx,
        });
    },
    postAction: obj => {
      if (Array.isArray(obj))
        debugOut({
          ns: 'app:db:result',
          msg: '%o document' + (obj.length === 1 ? '' : 's'),
          ctx,
        }, obj.length);
      else
        debugOut({
          ns: 'app:db:result',
          msg: obj,
          ctx,
        });
    },
  }),
  auctionStopperModel: ({ auctionAdapter, debugOut }) => (ctx, id, winningBid, endAuction) => () => {
    auctionAdapter.findById(id).then(obj => {
      if (obj.winningBid !== winningBid)
        return;

      return endAuction({ ctx, id });
    }).then(obj => {
      if (!obj)
        return;

      debugOut({
        ns: 'app:auction',
        msg: 'Closed: %o',
      }, id);
    }).catch(reason => {
      debugOut({
        ns: 'app:auction',
        msg: 'Failed to close %o: %o',
      }, id, reason);
    });
  }
};