const logInit = require("./log");
const lobbyInit = require("./lobby");
const responseInit = require("./response");
const errorInit = require("./error");
const notfoundInit = require("./notfound");


/**
 * 
 * @param {typeof dependencies} 
 */
const initAdapter = () => {
  const preRequest = [
    lobbyInit,
    logInit,
    errorInit,
  ];

  const postRequest = [
    notfoundInit,
    responseInit,
  ];

  return {
    preRequest: preRequest.map(m => m.make(m.dependencies)),
    postRequest: postRequest.map(m => m.make(m.dependencies)),
  };
};


const dependencies = {};

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initAdapter(dependencies),
};



