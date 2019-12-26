import test from "ava";
import listen from "test-listen";
import http_server from "http";
import setupInit from "../../app/setup";
import { generateNewDatabaseURI, serverResponseStructure, validAuctionCreationPayload, assertDualStructureTypeChecker, contentType } from "../constants";

const http = require("ava-http");

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

/////////////////////// CREATE AUCTION ///////////////////////

test('Should create an action', async t => {
  const expectedResponseStructure = serverResponseStructure;
  const expectedStatusCode = 200;
  const requestPayload = validAuctionCreationPayload;

  expectedResponseStructure.Result = {
    id: '',
    item: '',
    description: '',
    startingPrice: 0,
    winningBid: null,
    startTime: null,
    endTime: null,
    status: "waiting"
  };

  const resp = await http.postResponse(`${t.context.baseURL}/auction`, {
    body: requestPayload,
  });

  t.is(resp.statusCode, expectedStatusCode);
  t.is(resp.headers['content-type'], contentType);
  assertDualStructureTypeChecker(t, resp.body, expectedResponseStructure);
});

///////////////////////

test('Should fail to create auction due to missing payload', async t => {
  const expectedResponseStructure = serverResponseStructure;
  const expectedStatusCode = 400;

  expectedResponseStructure.Meta.status = 'Bad Request';

  let resp;

  try {
    await http.postResponse(`${t.context.baseURL}/auction`);

    t.fail('This method should not be executed');
  }
  catch (ex) {
    resp = ex.response;
  }

  t.is(resp.statusCode, expectedStatusCode);
  t.is(resp.headers['content-type'], contentType);
  assertDualStructureTypeChecker(t, resp.body, expectedResponseStructure);

  t.is(resp.body.Result, expectedResponseStructure.Result);
  t.is(resp.body.Meta.status, expectedResponseStructure.Meta.status);
});


test('Should fail to create auction due to missing properties in payload', async t => {
  const expectedResponseStructure = serverResponseStructure;
  const expectedStatusCode = 400;
  const modelPayload = validAuctionCreationPayload;

  expectedResponseStructure.Meta.status = 'Bad Request';

  for (const a in modelPayload) {
    const requestPayload = { ...modelPayload };
    delete requestPayload[a];

    let resp;

    try {
      await http.postResponse(`${t.context.baseURL}/auction`, {
        body: requestPayload,
      });

      t.fail('This method should not be executed');
    }
    catch (ex) {
      resp = ex.response;
    }

    t.is(resp.statusCode, expectedStatusCode);
    t.is(resp.headers['content-type'], contentType);
    assertDualStructureTypeChecker(t, resp.body, expectedResponseStructure);
    t.is(resp.body.Meta.status, expectedResponseStructure.Meta.status);
  }
});


test('Should fail to create auction due to empty string in payload', async t => {
  const expectedResponseStructure = serverResponseStructure;
  const expectedStatusCode = 400;
  const modelPayload = validAuctionCreationPayload;
  const stringProps = Object.values(modelPayload)
    .filter(f => typeof f === 'string');

  expectedResponseStructure.Meta.status = 'Bad Request';

  for (const a of stringProps) {
    const requestPayload = { ...modelPayload };
    requestPayload[a] = '';

    let resp;

    try {
      await http.postResponse(`${t.context.baseURL}/auction`, {
        body: requestPayload,
      });

      t.fail('This method should not be executed');
    }
    catch (ex) {
      resp = ex.response;
    }

    t.is(resp.statusCode, expectedStatusCode);
    t.is(resp.headers['content-type'], contentType);
    assertDualStructureTypeChecker(t, resp.body, expectedResponseStructure);
    t.is(resp.body.Meta.status, expectedResponseStructure.Meta.status);
  }
});


test('Should fail to create an action due to invalid starting price', async t => {
  const expectedResponseStructure = serverResponseStructure;
  const expectedStatusCode = 400;
  const requestPayload = validAuctionCreationPayload;
  requestPayload.startingPrice = 0;

  expectedResponseStructure.Meta.status = 'Bad Request';

  let resp;

  try {
    await http.postResponse(`${t.context.baseURL}/auction`, {
      body: requestPayload,
    });

    t.fail('This method should not be executed');
  }
  catch (ex) {
    resp = ex.response;
  }

  t.is(resp.statusCode, expectedStatusCode);
  t.is(resp.headers['content-type'], contentType);
  assertDualStructureTypeChecker(t, resp.body, expectedResponseStructure);
});


test('Should fail to create auction due to invalid email format in payload', async t => {
  const expectedResponseStructure = serverResponseStructure;
  const expectedStatusCode = 400;
  const modelPayload = validAuctionCreationPayload;
  const options = [
    'invalid_mail.dom',
    'invalid.mail.dom',
    'invalid@mail.dom.',
    '.invalid@mail.dom',
    'invalid@m@il.dom',
    'invalid@ma!l.dom',
    'invalid@mail .dom',
    'invalid @mail.dom',
    'invalid@mail',
  ];

  expectedResponseStructure.Meta.status = 'Bad Request';

  for (const a of options) {
    const requestPayload = { ...modelPayload };
    requestPayload.email = a;

    let resp;

    try {
      await http.postResponse(`${t.context.baseURL}/auction`, {
        body: requestPayload,
      });

      t.fail('This method should not be executed');
    }
    catch (ex) {
      resp = ex.response;
    }

    t.is(resp.statusCode, expectedStatusCode);
    t.is(resp.headers['content-type'], contentType);
    assertDualStructureTypeChecker(t, resp.body, expectedResponseStructure);
    t.is(resp.body.Meta.status, expectedResponseStructure.Meta.status);
  }
});