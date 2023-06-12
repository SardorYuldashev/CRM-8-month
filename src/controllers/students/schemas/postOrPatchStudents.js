const Joi = require('joi');

exports.postOrPatchtStudentSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required()
});