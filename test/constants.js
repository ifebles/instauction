const { MongoMemoryServer } = require("mongodb-memory-server");
const http = require("ava-http");


const typesVeredict = (subject, model) => {
  if (typeof subject !== typeof model)
    return 'different';

  if (typeof subject !== 'object' && typeof subject === typeof model)
    return 'equal';

  if (subject === null || model === null) {
    if (subject !== model)
      return 'different';

    return 'equal';
  }

  if (Array.isArray(subject) || Array.isArray(model)) {
    if (Array.isArray(subject) && Array.isArray(model))
      return 'equal';

    return 'different';
  }

  return 'alike';
};


const structureTypeChecker = (subject, model, fieldName = 'obj') => {
  const veredict = typesVeredict(subject, model);
  const response = {
    ns: fieldName,
    result: false,
    reason: veredict,
  };

  switch (veredict) {
    case 'different':
      return response;
    case 'equal':
      response.result = true;
      return response;
  }

  for (const a in subject) {
    const resp = structureTypeChecker(subject[a], model[a], a);

    if (!resp.result) {
      response.ns += `.${resp.ns}`;

      return response;
    }
  }

  response.result = true;
  return response;
};


const ofuscateArrays = (obj) => {
  switch (typeof obj) {
    case 'object':
      if (obj === null)
        return obj;

      if (Array.isArray(obj))
        return ['...'];

      const objCopy = { ...obj };

      for (const a in objCopy)
        objCopy[a] = ofuscateArrays(objCopy[a]);

      return objCopy;

    default:
      if (typeof obj === 'string')
        return obj.length > 103 ? obj.substr(0, 100).trimRight() + '...' : obj;

      return obj;
  }
}


const dbConfig = {
  binaries: '/usr/bin/mongod',
  host: '127.0.0.1',
};


module.exports = {
  get dbConfig() {
    return { ...dbConfig };
  },
  get requiredAuctionAdapterCreatorStructure() {
    return {
      create: async () => ({}),
      findByIdAndUpdate: async () => ({}),
      findOneAndUpdate: async () => ({}),
      update: async () => [],
      find: async () => [],
      findOne: async () => ({}),
      findById: async () => ({}),
    };
  },
  get validPaginationObject() {
    return {
      page: 1,
      items_per_page: 5,
    };
  },
  assertDualStructureTypeChecker(t, subject, expected) {
    const getResponseMessage = typeChecker => {
      const phrasing = typeChecker.reason === 'different' ? 'is not equal to' : 'has a non matching property with';
      const namespace = typeChecker.reason === 'alike' ? `Path: "${typeChecker.ns}"\n\n` : '';

      return `The subject ${phrasing} the expected value:\n\n${namespace}Subject -> ${
        JSON.stringify(ofuscateArrays(subject), null, ' ')}\n\n--------------\n\nExpected -> ${JSON.stringify(ofuscateArrays(expected), null, ' ')}`;
    };

    let resp = structureTypeChecker(subject, expected, 'subject');

    t.true(
      resp.result,
      getResponseMessage(resp)
    );

    if (!resp.result)
      return;

    resp = structureTypeChecker(expected, subject, 'expected');

    t.true(
      resp.result,
      getResponseMessage(resp)
    );
  },
  generateNewDatabaseURI: () => {
    const mongod = new MongoMemoryServer({
      // debug: true,
      binary: { systemBinary: dbConfig.binaries },
    });

    return mongod.getConnectionString();
  },
  createAuction: (host, payload) => {
    return http.post(`${host}/auction`, {
      body: payload,
    });
  },
  startAuction: (host, id) => http.post(`${host}/auction/${id}/start`),

  get serverResponseStructure() {
    return {
      Meta: {
        status: '',
        now: 0,
        requestId: '',
      },
      Result: null,
    };
  },
  get validAuctionCreationPayload() {
    return {
      item: 'the item',
      description: 'the desc',
      email: 'mail@dunno.com',
      startingPrice: 15,
    };
  },
  getValidBidCreationPayload: auctionId => {
    return {
      email: 'mail2@dunno.com',
      amount: 16,
      auctionId,
    };
  },
  get contentType() {
    return 'application/json; charset=utf-8';
  },
};