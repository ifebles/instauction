const setupInit = require("./setup");

const setup = setupInit.make(setupInit.dependencies);

setup.startServer()
  .catch(reason => {
    console.error(reason);
  });
