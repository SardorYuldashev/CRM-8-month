const express = require('express');
const genValidator = require('../shared/validator');
const { isLoggedIn, hasRole } = require('../shared/auth');
const controllers = require('../controllers/groups')
const schemas = require('../controllers/groups/schemas');

const router = express.Router();

// groups
router.post('/groups', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postAndPatchGroupSchema), controllers.postGroup);
router.get('/groups', isLoggedIn, controllers.getGroups);
router.get('/groups/:id', isLoggedIn, controllers.showGroup);
router.patch('/groups/:id', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postAndPatchGroupSchema), controllers.patchGroup);
router.delete('/groups/:id', isLoggedIn, hasRole(['super_admin', 'admin']), controllers.deleteGroup);

// groups_students
router.post('/groups/:id/students/:student_id', isLoggedIn, hasRole(['super_admin', 'admin']), controllers.addStudent);
router.delete('/groups/:id/students/:student_id', isLoggedIn, hasRole(['super_admin', 'admin']), controllers.removeFromGroup);
router.get('/groups/:id/students', isLoggedIn, hasRole(['super_admin', 'admin']), controllers.getListStudentsOfGroup);

module.exports = router;