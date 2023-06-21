const express = require('express');
const genValidator = require('../shared/validator');
const {
  isLoggedIn,
  hasRole
} = require('../shared/auth');
const {
  postStudent,
  getStudents,
  showStudent,
  patchStudent,
  deleteStudent
} = require('../controllers/students');
const schemas = require('../controllers/students/schemas');

const router = express.Router();

const mPostStudent = [isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postOrPatchtStudentSchema)];
const mGetStudents = [isLoggedIn];
const mShowStudent = [isLoggedIn];
const mPatchStudent = [isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postOrPatchtStudentSchema)];
const mDeleteStudent = [isLoggedIn, hasRole(['super_admin', 'admin'])];

router.post('/students', mPostStudent, postStudent);
router.get('/students', mGetStudents, getStudents);
router.get('/students/:id', mShowStudent, showStudent);
router.patch('/students/:id', mPatchStudent, patchStudent);
router.delete('/students/:id', mDeleteStudent, deleteStudent);

module.exports = router;