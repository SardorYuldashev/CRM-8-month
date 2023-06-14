const express = require('express');
const db = require('../../db');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const postDirection = async (req, res) => {
  try {
    const {name} = req.body;

    const existing = await db('directions').where({name});

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

module.exports = {
  postDirection,
};