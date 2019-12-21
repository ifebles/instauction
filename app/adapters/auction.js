


/**
 * 
 * @param {typeof dependencies} 
 */
const initAdapter = () => ({ auctionModel }) => ({
  create: async (payload, hooks = { preAction: async () => { }, postAction: async () => { } }) => {
    if (hooks.preAction)
      await hooks.preAction({ payload });

    const document = await auctionModel.create(payload);

    if (hooks.postAction)
      await hooks.postAction(document);

    return document;
  },
  updateById: async (id, payload, hooks = { preAction: async () => { }, postAction: async () => { } }) => {
    if (hooks.preAction)
      await hooks.preAction({ id, payload });

    const document = await auctionModel.findByIdAndUpdate(id, payload);

    if (hooks.postAction)
      await hooks.postAction(document);

    return document;
  },
  update: async (query, payload, hooks = { preAction: async () => { }, postAction: async () => { } }) => {
    if (hooks.preAction)
      await hooks.preAction({ payload });

    const documents = await auctionModel.update(query, payload);

    if (hooks.postAction)
      await hooks.postAction(documents);

    return documents;
  },
  find: async (query, hooks = { preAction: async () => { }, postAction: async () => { } }) => {
    if (hooks.preAction)
      await hooks.preAction({ query });

    const documents = await auctionModel.find(query);

    if (hooks.postAction)
      await hooks.postAction(documents);

    return documents;
  },
  findOne: async (query, hooks = { preAction: async () => { }, postAction: async () => { } }) => {
    if (hooks.preAction)
      await hooks.preAction({ query });

    const document = await auctionModel.findOne(query);

    if (hooks.postAction)
      await hooks.postAction(document);

    return document;
  },
  findById: async (id, hooks = { preAction: async () => { }, postAction: async () => { } }) => {
    if (hooks.preAction)
      await hooks.preAction({ id });

    const document = await bidModel.findById(id);

    if (hooks.postAction)
      await hooks.postAction(document);

    return document;
  },
});


const dependencies = {};

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initAdapter(dependencies),
};



