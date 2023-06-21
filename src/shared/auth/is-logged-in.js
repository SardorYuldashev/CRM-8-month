const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { UnauthorizedError } = require('../errors');

/**
 * Login qilganligini tekshirish uchun
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const isLoggedIn = (req, res, next) => {
  try {
    const { authorization: token } = req.headers;

    if (!token) {
      throw new UnauthorizedError('Login qilmagansiz.');
    };

    const decoded = jwt.verify(token, config.jwt.secret);

    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Login qilmagansiz.',
    });
  };
};

module.exports = isLoggedIn;
