import test from "ava";
import listen from "test-listen";
import http_server from "http";
import setupInit from "../../app/setup";
import {
  contentType,
  generateNewDatabaseURI,
  serverResponseStructure,
  validAuctionCreationPayload,
  assertDualStructureTypeChecker,
  createAuction,
  getValidBidCreationPayload,
  startAuction,
} from "../constants";

const http = require("ava-http");

/*
  Check file "/test/routes/auction.int.test.js" for a more detailed integration test representation
*/

/////////////////////// FIXTURES ///////////////////////

test.before(async t => {
  const setup = setupInit.make(setupInit.dependencies);
  const dbURI = await generateNewDatabaseURI();

  await setup.setDatabaseConnection(dbURI);

  t.context.server = http_server.createServer(setup.app.callback());
  t.context.baseURL = await listen(t.context.server, '127.0.0.1');

});

test.after.always(t => {
  t.context.server.close();
});

/////////////////////// CREATE BID ///////////////////////

test('Should create a bid', async t => {
  const expectedResponseStructure = serverResponseStructure;
  const expectedStatusCode = 200;
  const auction = await createAuction(t.context.baseURL, validAuctionCreationPayload);
  const requestPayload = getValidBidCreationPayload(auction.Result.id);

  expectedResponseStructure.Result = {
    id: '',
    ...requestPayload,
    date: '',
  };

  await startAuction(t.context.baseURL, auction.Result.id);
  
  const resp = await http.postResponse(`${t.context.baseURL}/bid`, {
    body: requestPayload,
  });

  t.is(resp.statusCode, expectedStatusCode);
  t.is(resp.headers['content-type'], contentType);
  assertDualStructureTypeChecker(t, resp.body, expectedResponseStructure);

  const dummyResp = { ...expectedResponseStructure.Result };
  dummyResp.id = resp.body.Result.id;
  dummyResp.date = resp.body.Result.date;

  t.deepEqual(resp.body.Result, dummyResp);
});