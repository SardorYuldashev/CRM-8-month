const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../db');
const config = require('../../shared/config');
const { NotFoundError, UnauthorizedError } = require('../../shared/errors');

/**
 * Post stuff
 * 1. Yangi stuff qo'shishni faqat admin va super_admin qila olishi kerak
 * @param {express.Request} req
 * @param {express.Response} res
 */
const postStuff = async (req, res, next) => {
  try {
    const { first_name, last_name, role, username, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await db('stuff')
      .insert({
        first_name,
        last_name,
        role,
        username,
        password: hashPassword,
      })
      .returning('*');

    res.status(201).json({
      user: result[0],
    });
  } catch (error) {
    next(error);
  };
};

/**
 * Get list of stuff
 * 1. Login qilgan hamma xodimlar ko'ra olishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getStuff = async (req, res, next) => {
  try {
    const { role, q, offset = 0, limit = 5, sort_by = 'id', sort_order = 'desc' } = req.query;

    const dbQuery = db('stuff').select('id', 'first_name', 'last_name', 'role', 'username');

    if (role) {
      dbQuery.where({ role });
    };

    if (q) {
      dbQuery.andWhereILike('first_name', `%${q}%`).orWhereILike('last_name', `%${q}%`);
    };

    const total = await dbQuery.clone().count().groupBy('id');

    dbQuery.orderBy(sort_by, sort_order);

    dbQuery.limit(limit).offset(offset);

    const stuff = await dbQuery;

    res.status(200).json({
      stuff,
      pageInfo: {
        total: total.length,
        offset,
        limit,
      }
    });
  } catch (error) {
    next(error);
  };
};

/**
 * Get single stuff
 * 1. Login qilgan hamma xodimlar ko'ra olishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const showStuff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stuff = await db('stuff')
      .select('id', 'first_name', 'last_name', 'role', 'username')
      .where({ id })
      .first();

    if (!stuff) {
      throw new NotFoundError(`${id} IDli xodim topilmadi.`);
    };

    res.status(200).json({
      stuff,
    });
  } catch (error) {
    next(error);
  };
};

/**
 * Login stuff
 * Xodim tizimga kirish uchun login qilishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const loginStuff = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existing = await db('stuff').where({ username }).select('id', 'password', 'role').first();

    if (!existing) {
      throw new UnauthorizedError('Username yoki password xato.');
    }

    const passwordCompare = await bcrypt.compare(password, existing.password);

    if (!passwordCompare) {
      throw new UnauthorizedError('Username yoki password xato.');
    }

    const token = jwt.sign({ id: existing.id, role: existing.role }, config.jwt.secret, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
    });
  } catch (error) {
    next(error);
  };
};

/**
 * Update stuff
 * 1. Faqat super_admin va admin boshqa xodimlarni ma'lumotlarini tahrirlay oladi
 * @param {express.Request} req
 * @param {express.Response} res
 */
const patchStuff = async (req, res, next) => {
  try {
    const { ...changes } = req.body;

    if (changes.password) {
      changes.password = await bcrypt.hash(changes.password, 10);
    };

    const { id } = req.params;

    const existing = await db('stuff').where({ id }).first();

    if (!existing) {
      throw new NotFoundError(`${id} idli xodim topilmadi.`);
    };

    const updated = await db('stuff')
      .where({ id })
      .update({ ...changes })
      .returning(['id', 'first_name', 'last_name', 'role', 'username']);

    res.status(200).json({
      updated: updated[0],
    });
  } catch (error) {
    next(error);
  };
};

/**
 * Delete stuff
 * 1. Faqat super_admin va admin boshqa xodimlarni o'chira oladi
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deleteStuff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await db('stuff').where({ id }).first();

    if (!existing) {
      throw new NotFoundError(`${id} idli xodim topilmadi.`);
    };

    const deleted = await db('stuff')
      .where({ id })
      .delete()
      .returning(['id', 'first_name', 'last_name', 'role', 'username']);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    next(error);
  };
};

module.exports = {
  postStuff,
  getStuff,
  showStuff,
  loginStuff,
  patchStuff,
  deleteStuff,
};
