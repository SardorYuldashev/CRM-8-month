const express = require('express');
const genValidator = require('../shared/validator');
const {
  isLoggedIn,
  hasRole
} = require('../shared/auth');
const {
  postDirection,
  getDirections,
  showDirection,
  patchDirection,
  deleteDirection
} = require('../controllers/directions')
const schemas = require('../controllers/directions/schemas');

const router = express.Router();

const mPostDirection = [isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postAndPatchDirectionSchema)];
const mGetDirections = [isLoggedIn];
const mShowDirection = [isLoggedIn];
const mPatchDirection = [isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postAndPatchDirectionSchema)];
const mDeleteDirection = [isLoggedIn, hasRole(['super_admin', 'admin'])];

router.post('/directions', mPostDirection, postDirection);
router.get('/directions', mGetDirections, getDirections);
router.get('/directions/:id', mShowDirection, showDirection);
router.patch('/directions/:id', mPatchDirection, patchDirection);
router.delete('/directions/:id', mDeleteDirection, deleteDirection);

module.exports = router;