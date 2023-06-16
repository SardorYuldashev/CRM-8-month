const express = require('express');
const db = require('../../db');

/**
 * Guruh yaratish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const postGroup = async (req, res) => {
  try {
    const { name, teacher_id, assistent_teacher_id } = req.body;

    const existing = await db('groups').where({ name });

    if (existing.length == 1) {
      return res.status(400).json({
        error: 'Bunday guruh mavjud'
      });
    };

    if (teacher_id) {
      const existing = await db('stuff').where({ id: teacher_id }).first();

      if (!existing || existing.role !== 'teacher') {
        return res.status(400).json({
          error: 'Teacher mavjud emas'
        });
      };
    };

    if (assistent_teacher_id) {
      const existing = await db('stuff').where({ id: assistent_teacher_id }).first();

      if (!existing || existing.role !== 'assistent_teacher') {
        return res.status(400).json({
          error: 'Assistent teacher mavjud emas'
        });
      };
    };

    const result = await db('groups').insert({ name, teacher_id, assistent_teacher_id }).returning('*');

    res.status(201).json({
      group: result[0]
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  };
};


/**
 * Guruhlar ro'yxatini olish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getGroups = async (req, res) => {
  try {
    const result = await db('groups')
      .leftJoin('stuff as stuff_teacher', 'stuff_teacher.id', 'groups.teacher_id')
      .leftJoin('stuff as stuff_assistent', 'stuff_assistent.id', 'groups.assistent_teacher_id')
      .select(
        'groups.id',
        'groups.name',
        db.raw("CONCAT(stuff_teacher.first_name, ' ', stuff_teacher.last_name) as teacher"),
        db.raw("CONCAT(stuff_assistent.first_name, ' ', stuff_assistent.last_name) as assistent"),
      );


    res.status(201).json({
      group: result
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  };
};

/**
 * Bitta guruhni olish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const showGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await db('groups')
      .leftJoin('stuff as stuff_teacher', 'stuff_teacher.id', 'groups.teacher_id')
      .leftJoin('stuff as stuff_assistent', 'stuff_assistent.id', 'groups.assistent_teacher_id')
      .select(
        'groups.id',
        'groups.name',
        db.raw("CONCAT(stuff_teacher.first_name, ' ', stuff_teacher.last_name) as teacher"),
        db.raw("CONCAT(stuff_assistent.first_name, ' ', stuff_assistent.last_name) as assistent"),
      )
      .where({ 'groups.id': id })
      .first();

    if (!group) {
      return res.status(404).json({
        error: 'Guruh topilmadi',
      });
    };

    res.status(200).json({
      group
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  };
};

/**
 * Guruhni tashrirlash
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const patchGroup = async (req, res) => {
  try {
    const { ...changes } = req.body;

    const { id } = req.params;

    const existingGroup = await db('groups').where({ id }).first();

    if (!existingGroup) {
      return res.status(404).json({
        error: `${id} idli guruh topilmadi.`,
      });
    };

    if (changes.teacher_id) {
      const existing = await db('stuff').where({ id: changes.teacher_id }).first();

      if (!existing || existing.role !== 'teacher') {
        return res.status(400).json({
          error: 'Teacher mavjud emas'
        });
      };
    };

    if (changes.assistent_teacher_id) {
      const existing = await db('stuff').where({ id: changes.assistent_teacher_id }).first();

      if (!existing || existing.role !== 'assistent_teacher') {
        return res.status(400).json({
          error: 'Assistent teacher mavjud emas'
        });
      };
    };

    const updated = await db('groups')
      .where({ id })
      .update({ ...changes })
      .returning(['id', 'name', 'teacher_id', 'assistent_teacher_id']);

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
 * Guruhni o'chirish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db('groups').where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} idli guruh topilmadi`,
      });
    };

    const deleted = await db('groups')
      .where({ id })
      .delete()
      .returning(['id', 'name', 'teacher_id', 'assistent_teacher_id']);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  };
};

/**
 * Bitta guruhni olish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const addStudent = async (req, res) => {
  try {
    const { id, student_id } = req.params;

    const result = await db('groups_students').insert({ group_id: id, student_id }).returning('*');

    res.status(201).json({
      result
    })


  } catch (error) {
    res.status(500).json({
      error
    });
  };
};

module.exports = {
  postGroup,
  getGroups,
  showGroup,
  patchGroup,
  deleteGroup,
  addStudent
};