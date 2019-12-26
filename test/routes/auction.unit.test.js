import test from "ava";
import sinon from "sinon";
import { requiredAuctionAdapterCreatorStructure as auctionModel, validPaginationObject as pagination } from "../constants";
import auctionAdapterInit from "../../app/adapters/auction";


///////////////////////////// FIXTURES /////////////////////////////

test.beforeEach(async t => {
  t.context.adapterCreator = auctionAdapterInit.make(auctionAdapterInit.dependencies);
  // t.context.adapter = t.context.adapterCreator(auctionModel);
});

///////////////////////////// MODULE STRUCTURE /////////////////////////////

test('Should be a maker object that returns a function', t => {
  const makerPayload = {};

  t.is(typeof auctionAdapterInit, 'object');
  t.deepEqual(Object.keys(auctionAdapterInit), ['dependencies', 'make']);

  const auctionAdapterCreator = auctionAdapterInit.make(makerPayload);
  t.is(typeof auctionAdapterCreator, 'function');

  const auctionAdapter = auctionAdapterCreator({ auctionModel });
  t.is(typeof auctionAdapter, 'object');
});

///////////////////////////// METHOD: CREATE /////////////////////////////

test('Should return an object representing the "created" document', async t => {
  const methodPayload = {};
  const methodResult = {};
  const adapterDependecy = auctionModel;
  adapterDependecy.create = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });

  const result = await auctionAdapter.create(methodPayload);

  t.true(adapterDependecy.create.calledOnce);
  t.true(adapterDependecy.create.calledWithExactly(methodPayload));
  t.deepEqual(result, methodResult);
});


test('Should call the designated hooks properly (create)', async t => {
  const methodPayload = {};
  const methodResult = { dummyResult: true };
  const adapterDependecy = auctionModel;
  adapterDependecy.create = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });
  const hooks = {
    preAction: sinon.fake(),
    postAction: sinon.fake(),
  };

  await auctionAdapter.create(methodPayload, hooks);

  t.true(hooks.preAction.calledOnce);
  t.true(hooks.postAction.calledOnce);
  t.true(hooks.preAction.calledWithExactly({ payload: methodPayload }));
  t.true(hooks.postAction.calledWithExactly(methodResult));
});

///////////////////////////// METHOD: UPDATEBYID /////////////////////////////

test('Should return an object representing the "updated" document (updateById)', async t => {
  const methodId = '';
  const methodPayload = {};
  const methodResult = {};
  const adapterDependecy = auctionModel;
  adapterDependecy.findByIdAndUpdate = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });

  const result = await auctionAdapter.updateById(methodId, methodPayload);

  t.true(adapterDependecy.findByIdAndUpdate.calledOnce);
  t.true(adapterDependecy.findByIdAndUpdate.calledWith(methodId, methodPayload));
  t.deepEqual(result, methodResult);
});


test('Should call the designated hooks properly (updateById)', async t => {
  const methodId = '';
  const methodPayload = {};
  const methodResult = { dummyResult: true };
  const adapterDependecy = auctionModel;
  adapterDependecy.findByIdAndUpdate = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });
  const hooks = {
    preAction: sinon.fake(),
    postAction: sinon.fake(),
  };

  await auctionAdapter.updateById(methodId, methodPayload, hooks);

  t.true(hooks.preAction.calledOnce);
  t.true(hooks.postAction.calledOnce);
  t.true(hooks.preAction.calledWithExactly({ id: methodId, payload: methodPayload }));
  t.true(hooks.postAction.calledWithExactly(methodResult));
});

///////////////////////////// METHOD: UPDATEONE /////////////////////////////

test('Should return an object representing the "updated" document (updateOne)', async t => {
  const methodQuery = {};
  const methodPayload = {};
  const methodResult = {};
  const adapterDependecy = auctionModel;
  adapterDependecy.findOneAndUpdate = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });

  const result = await auctionAdapter.updateOne(methodQuery, methodPayload);

  t.true(adapterDependecy.findOneAndUpdate.calledOnce);
  t.true(adapterDependecy.findOneAndUpdate.calledWith(methodQuery, methodPayload));
  t.deepEqual(result, methodResult);
});


test('Should call the designated hooks properly (updateOne)', async t => {
  const methodQuery = {};
  const methodPayload = {};
  const methodResult = { dummyResult: true };
  const adapterDependecy = auctionModel;
  adapterDependecy.findOneAndUpdate = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });
  const hooks = {
    preAction: sinon.fake(),
    postAction: sinon.fake(),
  };

  await auctionAdapter.updateOne(methodQuery, methodPayload, hooks);

  t.true(hooks.preAction.calledOnce);
  t.true(hooks.postAction.calledOnce);
  t.true(hooks.preAction.calledWithExactly({ query: methodQuery, payload: methodPayload }));
  t.true(hooks.postAction.calledWithExactly(methodResult));
});

///////////////////////////// METHOD: UPDATE /////////////////////////////

test('Should return an object representing the "updated" document (update)', async t => {
  const methodQuery = {};
  const methodPayload = {};
  const methodResult = [];
  const adapterDependecy = auctionModel;
  adapterDependecy.update = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });

  const result = await auctionAdapter.update(methodQuery, methodPayload);

  t.true(adapterDependecy.update.calledOnce);
  t.true(adapterDependecy.update.calledWith(methodQuery, methodPayload));
  t.deepEqual(result, methodResult);
});


test('Should call the designated hooks properly (update)', async t => {
  const methodQuery = {};
  const methodPayload = {};
  const methodResult = [{ dummyResult: true }];
  const adapterDependecy = auctionModel;
  adapterDependecy.update = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });
  const hooks = {
    preAction: sinon.fake(),
    postAction: sinon.fake(),
  };

  await auctionAdapter.update(methodQuery, methodPayload, hooks);

  t.true(hooks.preAction.calledOnce);
  t.true(hooks.postAction.calledOnce);
  t.true(hooks.preAction.calledWithExactly({ query: methodQuery, payload: methodPayload }));
  t.true(hooks.postAction.calledWithExactly(methodResult));
});

///////////////////////////// METHOD: FIND /////////////////////////////

test('Should return an object representing the "found" document (find)', async t => {
  const methodQuery = {};
  const methodResult = [];
  const adapterDependecy = auctionModel;
  adapterDependecy.find = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });

  const result = await auctionAdapter.find(methodQuery);

  t.true(adapterDependecy.find.calledOnce);
  t.true(adapterDependecy.find.calledWithExactly(methodQuery));
  t.deepEqual(result, methodResult);
});


test('Should return an object representing the "found" document (find - paginated)', async t => {
  const methodQuery = {};
  const methodResult = [];
  const stubbedResult = Promise.resolve(methodResult);
  const adapterDependecy = auctionModel;
  const limitFake = sinon.fake();
  const skipFake = sinon.fake.returns({ limit: limitFake });
  stubbedResult.skip = skipFake;
  adapterDependecy.find = sinon.fake.returns(stubbedResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });

  const result = await auctionAdapter.find(methodQuery, pagination);

  t.true(adapterDependecy.find.calledOnce);
  t.true(skipFake.calledOnce);
  t.true(limitFake.calledOnce);
  t.true(adapterDependecy.find.calledWithExactly(methodQuery));
  t.true(skipFake.calledWithExactly(pagination.items_per_page * (pagination.page - 1)));
  t.true(limitFake.calledWithExactly(pagination.items_per_page));
  t.deepEqual(result, methodResult);
});


test('Should call the designated hooks properly (find - paginated)', async t => {
  const methodQuery = {};
  const methodResult = { dummyResult: true };
  const stubbedResult = Promise.resolve(methodResult);
  stubbedResult.skip = () => ({ limit: () => { } });
  const adapterDependecy = auctionModel;
  adapterDependecy.find = sinon.fake.returns(stubbedResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });
  const hooks = {
    preAction: sinon.fake(),
    postAction: sinon.fake(),
  };

  await auctionAdapter.find(methodQuery, pagination, hooks);

  t.true(hooks.preAction.calledOnce);
  t.true(hooks.postAction.calledOnce);
  t.true(hooks.preAction.calledWithExactly({ query: methodQuery, pagination }));
  t.true(hooks.postAction.calledWithExactly(methodResult));
});

///////////////////////////// METHOD: FINDONE /////////////////////////////

test('Should return an object representing the "found" document (findOne)', async t => {
  const methodQuery = {};
  const methodResult = {};
  const adapterDependecy = auctionModel;
  adapterDependecy.findOne = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });

  const result = await auctionAdapter.findOne(methodQuery);

  t.true(adapterDependecy.findOne.calledOnce);
  t.true(adapterDependecy.findOne.calledWithExactly(methodQuery));
  t.deepEqual(result, methodResult);
});


test('Should call the designated hooks properly (findOne)', async t => {
  const methodQuery = {};
  const methodResult = { dummyResult: true };
  const adapterDependecy = auctionModel;
  adapterDependecy.findOne = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });
  const hooks = {
    preAction: sinon.fake(),
    postAction: sinon.fake(),
  };

  await auctionAdapter.findOne(methodQuery, hooks);

  t.true(hooks.preAction.calledOnce);
  t.true(hooks.postAction.calledOnce);
  t.true(hooks.preAction.calledWithExactly({ query: methodQuery }));
  t.true(hooks.postAction.calledWithExactly(methodResult));
});

///////////////////////////// METHOD: FINDBYID /////////////////////////////

test('Should return an object representing the "found" document (findById)', async t => {
  const methodId = '';
  const methodResult = {};
  const adapterDependecy = auctionModel;
  adapterDependecy.findById = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });

  const result = await auctionAdapter.findById(methodId);

  t.true(adapterDependecy.findById.calledOnce);
  t.true(adapterDependecy.findById.calledWithExactly(methodId));
  t.deepEqual(result, methodResult);
});


test('Should call the designated hooks properly (findById)', async t => {
  const methodQuery = {};
  const methodResult = { dummyResult: true };
  const adapterDependecy = auctionModel;
  adapterDependecy.findById = sinon.fake.returns(methodResult);
  const auctionAdapter = t.context.adapterCreator({ auctionModel: adapterDependecy });
  const hooks = {
    preAction: sinon.fake(),
    postAction: sinon.fake(),
  };

  await auctionAdapter.findById(methodQuery, hooks);

  t.true(hooks.preAction.calledOnce);
  t.true(hooks.postAction.calledOnce);
  t.true(hooks.preAction.calledWithExactly({ id: methodQuery }));
  t.true(hooks.postAction.calledWithExactly(methodResult));
});

