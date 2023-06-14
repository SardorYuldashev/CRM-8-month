const express = require('express');
const genValidator = require('../shared/validator');
const { isLoggedIn, hasRole } = require('../shared/auth');
const controllers = require('../controllers/groups')
const schemas = require('../controllers/groups/schemas');

const router = express.Router();

router.post('/groups', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postGroupSchema), controllers.postGroup);
router.get('/groups', isLoggedIn, controllers.getGroups);
router.get('/groups/:id', isLoggedIn, controllers.showGroup);

module.exports = router;