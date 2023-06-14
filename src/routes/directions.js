const express = require('express');
const genValidator = require('../shared/validator');
const { isLoggedIn, hasRole } = require('../shared/auth');
const controllers = require('../controllers/directions')
const schemas = require('../controllers/directions/schemas');

const router = express.Router();

router.post('/directions', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postAndPatchDirectionSchema), controllers.postDirection);
router.get('/directions', isLoggedIn, controllers.getDirections);
router.get('/directions/:id', isLoggedIn, controllers.showDirection);
router.patch('/directions/:id', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postAndPatchDirectionSchema), controllers.patchDirection);
router.delete('/directions/:id', isLoggedIn, hasRole(['super_admin', 'admin']), controllers.deleteDirection);


module.exports = router;