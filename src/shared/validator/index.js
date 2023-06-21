const Joi = require('joi');
const { BadReqqustError } = require('../errors');

/**
 *
 * @param {Joi.Schema} schema
 * @returns
 */
module.exports = function genValidator(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);

      next();
    } catch (error) {
      err = new BadReqqustError(error.details[0].message);
      next(err);
    };
  };
};
