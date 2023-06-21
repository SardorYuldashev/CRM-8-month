const express = require('express');
const genValidator = require('../shared/validator');
const {
  isLoggedIn,
  hasRole
} = require('../shared/auth');
const {
  postGroup,
  getGroups,
  showGroup,
  patchGroup,
  deleteGroup,
  addStudent,
  removeFromGroup,
  getListStudentsOfGroup
} = require('../controllers/groups');
const schemas = require('../controllers/groups/schemas');

const router = express.Router();

const mPostGroup = [isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postAndPatchGroupSchema)];
const mGetGroups = [isLoggedIn];
const mShowGroup = [isLoggedIn];
const mPatchGroup = [isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postAndPatchGroupSchema)];
const mDeleteGroup = [isLoggedIn, hasRole(['super_admin', 'admin'])];
const mAddStudent = [isLoggedIn, hasRole(['super_admin', 'admin'])];
const mRemoveFromGroup = [isLoggedIn, hasRole(['super_admin', 'admin'])];
const mGetListStudentsOfGroup = [isLoggedIn, hasRole(['super_admin', 'admin'])];


// groups
router.post('/groups', mPostGroup, postGroup);
router.get('/groups', mGetGroups, getGroups);
router.get('/groups/:id', mShowGroup, showGroup);
router.patch('/groups/:id', mPatchGroup, patchGroup);
router.delete('/groups/:id', mDeleteGroup, deleteGroup);

// groups_students
router.post('/groups/:id/students/:student_id', mAddStudent, addStudent);
router.delete('/groups/:id/students/:student_id', mRemoveFromGroup, removeFromGroup);
router.get('/groups/:id/students', mGetListStudentsOfGroup, getListStudentsOfGroup);

module.exports = router;