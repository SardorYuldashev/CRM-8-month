const express = require('express');
const db = require('../../db');
const { NotFoundError } = require('../../shared/errors');

/**
 * Post student
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const postStudent = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;

    const result = await db('students')
      .insert({
        first_name,
        last_name
      })
      .returning('*');

    res.status(201).json({
      student: result[0]
    });
  } catch (error) {
    next(error);
  };
};

/**
 * Get students list
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getStudents = async (req, res, next) => {
  try {
    const { q, offset = 0, limit = 5, sort_by = 'id', sort_order = 'desc' } = req.query;

    const dbQuery = db('students').select('id', 'first_name', 'last_name');

    if (q) {
      dbQuery.andWhereILike('first_name', `%${q}%`).orWhereILike('last_name', `%${q}%`);
    };

    const total = await dbQuery.clone().count().groupBy('id');

    dbQuery.orderBy(sort_by, sort_order);

    dbQuery.limit(limit).offset(offset);

    const students = await dbQuery;

    res.status(200).json({
      students,
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
 * Get single student
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const showStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await db('students')
      .select('id', 'first_name', 'last_name')
      .where({ id })
      .first();

    if (!student) {
      throw new NotFoundError(`O'quvchi topilmadi.`);
    };

    res.status(200).json({
      student
    });

  } catch (error) {
    next(error);
  };
};

/**
 * Edit student info
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const patchStudent = async (req, res, next) => {
  try {
    const { ...changes } = req.body;

    const { id } = req.params;

    const existing = await db('students').where({ id }).first();

    if (!existing) {
      throw new NotFoundError(`${id} idli o'quvchi topilmadi.`);
    };

    const updated = await db('students')
      .where({ id })
      .update({ ...changes })
      .returning(['id', 'first_name', 'last_name']);

    res.status(200).json({
      updated: updated[0],
    });

  } catch (error) {
    next(error);
  };
};

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await db('students').where({ id }).first();

    if (!existing) {
      throw new NotFoundError(`${id} idli o'quvchi topilmadi.`);
    };

    const deleted = await db('students')
      .where({ id })
      .delete()
      .returning(['id', 'first_name', 'last_name']);

    res.status(200).json({
      deleted: deleted[0],
    });

  } catch (error) {
    next(error);
  };
};

module.exports = {
  postStudent,
  getStudents,
  showStudent,
  patchStudent,
  deleteStudent
};