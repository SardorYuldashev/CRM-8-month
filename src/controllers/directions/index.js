const express = require('express');
const db = require('../../db');
const { BadReqqustError, NotFoundError } = require('../../shared/errors');

/**
 * Yo'nalish yaratish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const postDirection = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existing = await db('directions').where({ name });

    if (existing.length == 1) {
      throw new BadReqqustError('Bunday yo\'nalish mavjud');
    };

    const result = await db('directions').insert({ name }).returning('*');

    res.status(201).json({
      direction: result[0]
    });
  } catch (error) {
    next(error);
  };
};

/**
 * Yo'nalishlar ro'yxatini olish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getDirections = async (req, res, next) => {
  try {
    const { q, offset = 0, limit = 5, sort_by = 'id', sort_order = 'desc' } = req.query;

    const dbQuery = db('directions').select('id', 'name');

    if (q) {
      dbQuery.andWhereILike('name', `%${q}%`);
    };

    const total = await dbQuery.clone().count().groupBy('id');

    dbQuery.orderBy(sort_by, sort_order);

    dbQuery.limit(limit).offset(offset);

    const directions = await dbQuery;

    res.status(201).json({
      directions,
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
 * Bitta yo'nalishni olish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const showDirection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const direction = await db('directions').select().where({ id }).first();

    if (!direction) {
      throw new NotFoundError('Yo\'nalish topilmadi');
    };

    res.status(200).json({
      direction,
    });
  } catch (error) {
    next(error);
  };
};

/**
 * Yo'nalishni tahrirlash
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const patchDirection = async (req, res, next) => {
  try {
    const { name } = req.body;

    const { id } = req.params;

    const existing = await db('directions').where({ id }).first();

    if (!existing) {
      throw new NotFoundError(`${id} idli yo'nalish topilmadi.`);
    };

    const updated = await db('directions')
      .where({ id })
      .update({ name })
      .returning(['id', 'name']);

    res.status(200).json({
      updated: updated[0],
    });
  } catch (error) {
    next(error);
  };
};

/**
 * Yo'nalishni o'chirish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const deleteDirection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await db('directions').where({ id }).first();

    if (!existing) {
      throw new NotFoundError(`${id} idli yo'nalish topilmadi.`);
    };

    const deleted = await db('directions')
      .where({ id })
      .delete()
      .returning(['id', 'name']);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    next(error);
  };
};

module.exports = {
  postDirection,
  getDirections,
  showDirection,
  patchDirection,
  deleteDirection
};