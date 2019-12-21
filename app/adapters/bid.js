


/**
 * 
 * @param {typeof dependencies} 
 */
const initAdapter = () => ({ bidModel }) => ({
  create: async (payload, hooks = { preAction: async () => { }, postAction: async () => { } }) => {
    if (hooks.preAction)
      await hooks.preAction({ payload });

    const document = await bidModel.create(payload);

    if (hooks.postAction)
      await hooks.postAction(document);

    return document;
  },
  update: async (id, payload, hooks = { preAction: async () => { }, postAction: async () => { } }) => {
    if (hooks.preAction)
      await hooks.preAction({ id, payload });

    const document = await bidModel.findByIdAndUpdate(id, payload);

    if (hooks.postAction)
      await hooks.postAction(document);

    return document;
  },
  find: async (query = {}, hooks = { preAction: async () => { }, postAction: async () => { } }) => {
    if (hooks.preAction)
      await hooks.preAction({ query });

    const documents = await bidModel.find(query);

    if (hooks.postAction)
      await hooks.postAction(documents);

    return documents;
  },
  findOne: async (query, hooks = { preAction: async () => { }, postAction: async () => { } }) => {
    if (hooks.preAction)
      await hooks.preAction({ query });

    const document = await bidModel.findOne(query);

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



