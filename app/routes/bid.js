const Router = require("koa-router");


/**
* @callback InitReturnType
* @param {import("koa")} app
* @param {{}} services
* @returns {import("koa")}
*/


/**
 * 
 * @param {typeof dependencies} 
 * @returns {InitReturnType}
 */
const initRouter = ({
  Router,
}) => ({ app, services }) => {
  const router = new Router({
    prefix: '/bid',
  });

  const idParam = ':id([a-f0-9]{24})';

  ///////////////// POST /////////////////

  router.post('/', async (ctx, next) => {
    const payload = ctx.request.body;
    ctx.body = await services.bidService.createBid({
      ctx,
      payload,
      auctionService: services.auctionService,
    });

    await next();
  });

  ///////////////// GET /////////////////

  router.get(`/`, async (ctx, next) => {
    const { id } = ctx.params;
    ctx.body = await services.bidService.showBid({ ctx });

    await next();
  });

  router.get(`/${idParam}`, async (ctx, next) => {
    const { id } = ctx.params;
    ctx.body = await services.bidService.showBid({ ctx, id });

    await next();
  });

  /////////////////

  return app.use(router.routes());
};


const dependencies = { Router };

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initRouter(dependencies),
};



