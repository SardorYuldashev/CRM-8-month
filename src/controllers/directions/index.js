const express = require('express');
const db = require('../../db');

/**
 * Yo'nalish yaratish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const postDirection = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await db('directions').where({ name });

    if (existing.length == 1) {
      return res.status(400).json({
        error: 'Bunday yo\'nalish mavjud'
      });
    };

    const result = await db('directions').insert({ name }).returning('*');

    res.status(201).json({
      direction: result[0]
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  };
};

/**
 * Yo'nalishlar ro'yxatini olish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getDirections = async (req, res) => {
  try {
    const result = await db('directions').select();

    res.status(201).json({
      directions: result
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  };
};

/**
 * Bitta yo'nalishni olish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const showDirection = async (req, res) => {
  try {
    const { id } = req.params;

    const direction = await db('directions').select().where({ id }).first();

    if (!direction) {
      return res.status(404).json({
        error: 'Yo\'nalish topilmadi',
      });
    };

    res.status(200).json({
      direction,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  };
};

/**
 * Yo'nalishni tahrirlash
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const patchDirection = async (req, res) => {
  try {
    const { name } = req.body;

    const { id } = req.params;

    const existing = await db('directions').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} idli yo'nalish topilmadi.`,
      });
    };

    const updated = await db('directions')
      .where({ id })
      .update({ name })
      .returning(['id', 'name']);

    res.status(200).json({
      updated: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  };
};

/**
 * Yo'nalishni o'chirish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const deleteDirection = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db('directions').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} idli yo'nalish topilmadi.`,
      });
    };

    const deleted = await db('directions')
      .where({ id })
      .delete()
      .returning(['id', 'name']);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  };
};

module.exports = {
  postDirection,
  getDirections,
  showDirection,
  patchDirection,
  deleteDirection
};