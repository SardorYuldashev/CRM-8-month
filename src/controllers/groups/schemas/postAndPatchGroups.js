const Joi = require('joi');

exports.postAndPatchGroupSchema = Joi.object({
  name: Joi.string().required(),
  teacher_id: Joi.number().integer(),
  assistent_teacher_id: Joi.number().integer()
});