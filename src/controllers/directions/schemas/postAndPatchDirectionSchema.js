const Joi = require('joi');

exports.postAndPatchDirectionSchema = Joi.object({
  name: Joi.string().required()
});