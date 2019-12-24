const Router = require("koa-router");
const koaBody = require("koa-body");


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
  koaBody,
}) => ({ app, services }) => {
  const router = new Router({
    prefix: '/auction',
  });

  const idParam = ':id([a-f0-9]{24})';

  ///////////////// POST /////////////////

  router.post('/', koaBody(), async (ctx, next) => {
    const payload = ctx.request.body;
    ctx.body = await services.auctionService.createAuction({ ctx, payload });

    await next();
  });

  router.post(`/${idParam}/start`, async (ctx, next) => {
    const { id } = ctx.params;
    ctx.body = await services.auctionService.startAuction({ ctx, id });

    await next();
  });

  router.post(`/${idParam}/end`, async (ctx, next) => {
    const { id } = ctx.params;
    ctx.body = await services.auctionService.endAuction({ ctx, id });

    await next();
  });

  ///////////////// GET /////////////////

  router.get(`/`, async (ctx, next) => {
    const { page, items_per_page } = ctx.request.query;
    ctx.body = await services.auctionService.showAuction({
      ctx,
      pagination: { page, items_per_page },
    });

    await next();
  });

  router.get(`/${idParam}`, async (ctx, next) => {
    const { id } = ctx.params;
    ctx.body = await services.auctionService.showAuction({ ctx, id });

    await next();
  });

  router.get(`/${idParam}/bids`, async (ctx, next) => {
    const { id } = ctx.params;
    const { page, items_per_page } = ctx.request.query;
    ctx.body = await services.auctionService.showAuctionBids({
      ctx,
      id,
      pagination: { page, items_per_page },
    });

    await next();
  });

  router.get(`/${idParam}/status`, async (ctx, next) => {
    const { id } = ctx.params;
    ctx.body = await services.auctionService.auctionStatus({ ctx, id });

    await next();
  });

  router.get('/status', async (ctx, next) => {
    const { page, items_per_page } = ctx.request.query;
    ctx.body = await services.auctionService.auctionStatus({
      ctx,
      pagination: { page, items_per_page },
    });

    await next();
  });

  /////////////////

  return app.use(router.routes());
};


const dependencies = { Router, koaBody };

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initRouter(dependencies),
};



