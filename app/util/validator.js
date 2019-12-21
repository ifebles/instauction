const Joi = require("joi");
const { EMAIL_REGEXP, DOCUMENT_ID_REGEXP } = require("../util/constants");
const { RequestError, debugOut } = require("../util/utilityMethods");



/**
 * 
 * @param {typeof dependencies} 
 */
const initService = ({
  Joi,
  EMAIL_REGEXP,
  DOCUMENT_ID_REGEXP,
  RequestError,
  debugOut,
}) => ctx => {
  const throwError = (msg, status = 400) => genericError => {
    debugOut({
      ns: 'app:joi',
      msg: genericError,
      ctx,
    });

    throw new RequestError(msg, status);
  };

  return {
    auctionCreationPayload: obj => {
      const schema = Joi.object().keys({
        item: Joi.string()
          .required()
          .error(throwError('No valid "item" property found')),
        description: Joi.string()
          .required()
          .error(throwError('No valid "description" property found')),
        email: Joi.string()
          .required()
          .regex(EMAIL_REGEXP)
          .error(throwError('No valid "email" property found')),
        startingPrice: Joi.number()
          .required()
          .error(throwError('No valid "startingPrice" property found')),
      })
        .required()
        .error(throwError('Invalid object'));

      Joi.validate(obj, schema, { convert: false });
    },
    bidCreationPayload: obj => {
      const schema = Joi.object().keys({
        email: Joi.string()
          .required()
          .regex(EMAIL_REGEXP)
          .error(throwError('No valid "email" property found')),
        amount: Joi.number()
          .required()
          .error(throwError('No valid "amount" property found')),
        auctionId: Joi.string()
          .required()
          .regex(DOCUMENT_ID_REGEXP)
          .error(throwError('No valid "auctionId" property found')),
      })
        .required()
        .error(throwError('Invalid object'));

      Joi.validate(obj, schema, { convert: false });
    },
  };
};


const dependencies = {
  Joi,
  EMAIL_REGEXP,
  DOCUMENT_ID_REGEXP,
  RequestError,
  debugOut,
};

module.exports = {
  dependencies,
  /**
   * @param {typeof dependencies} dependencies
   */
  make: dependencies => initService(dependencies),
};



