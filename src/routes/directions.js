const express = require('express');
const genValidator = require('../shared/validator');
const { isLoggedIn, hasRole } = require('../shared/auth');
const controllers = require('../controllers/directions')
const schemas = require('../controllers/directions/schemas');

const router = express.Router();

router.post('/directions', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postAndPatchDirectionSchema), controllers.postDirection);



module.exports = router;