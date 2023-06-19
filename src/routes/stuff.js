const express = require('express');
const genValidator = require('../shared/validator');
const {
  isLoggedIn,
  hasRole
} = require('../shared/auth');
const {
  postStuff,
  getStuff,
  showStuff,
  loginStuff,
  patchStuff,
  deleteStuff
} = require('../controllers/stuff');
const schemas = require('../controllers/stuff/schemas');

const router = express.Router();

const mPostStuff = [isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postStuffSchema)];
const mGetStuff = [isLoggedIn];
const mShowStuff = [isLoggedIn];
const mLoginStuff = [genValidator(schemas.loginStuffSchema)];
const mPatchStuff = [isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.patchStuffSchema)];
const mDeleteStuff = [isLoggedIn, hasRole(['super_admin', 'admin'])];

router.post('/stuff', mPostStuff, postStuff);
router.get('/stuff', mGetStuff, getStuff);
router.get('/stuff/:id', mShowStuff, showStuff);
router.post('/stuff/login', mLoginStuff, loginStuff);
router.patch('/stuff/:id', mPatchStuff, patchStuff);
router.delete('/stuff/:id', mDeleteStuff, deleteStuff);

module.exports = router;