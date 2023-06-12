const express = require('express');
const genValidator = require('../shared/validator');
const { isLoggedIn, hasRole } = require('../shared/auth');
const controllers = require('../controllers/students')
const schemas = require('../controllers/students/schemas');

const router = express.Router();

router.post('/students', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postOrPatchtStudentSchema), controllers.postStudent);
router.get('/students', isLoggedIn, controllers.getStudents);
router.get('/students/:id', isLoggedIn, controllers.showStudent);
router.patch('/students/:id', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postOrPatchtStudentSchema), controllers.patchStudent);
router.delete('/students/:id', isLoggedIn, hasRole(['super_admin', 'admin']), controllers.deleteStudent);

module.exports = router;