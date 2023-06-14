const express = require('express');
const db = require('../../db');

/**Student va guruhni bog'lash
 * Post groups_students
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const postGroupsStudents = async (req, res) => {
  try {
    const { id, student_id } = req.params;

    const existingGroup = await db('groups').where({ id }).first();

    if (!existingGroup) {
      return res.status(400).json({
        error: `${id}-IDli guruh mavjud emas`
      });
    };

    const existingStudent = await db('students').where({ id: student_id }).first();

    if (!existingStudent) {
      return res.status(400).json({
        error: `${student_id}-IDli o'quvchi mavjud emas`
      });
    };

    const existing = await db('groups_students')
      .select()
      .where({ group_id: id, student_id: student_id })
      .first();

    if (existing) {
      const { name } = await db('groups')
        .select()
        .where({ id: existing.group_id })
        .first();

      const { first_name, last_name } = await db('students')
        .select()
        .where({ id: existing.student_id })
        .first();

      return res.status(400).json({
        error: `${last_name} ${first_name} '${name}' guruhiga  avval qo'shilgan`
      });
    };

    const result = await db('groups_students')
      .insert({ group_id: id, student_id: student_id })
      .returning('*');

    res.status(201).json({
      groups_students: result[0]
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  };
};

/** Bog'lanishni o'chirish
 * Post groups_students
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const deleteGroupsStudents = async (req, res) => {
  try {
    const { id, student_id } = req.params;

    const existing = await db('groups_students')
      .where({ group_id: id, student_id })
      .first();

    if (!existing) {
      return res.status(400).json({
        error: `Xato IDlar kiritilgan`
      });
    };

    const deleted = await db('groups_students')
      .where({ group_id: id, student_id })
      .delete()
      .returning(['id', 'group_id', 'student_id']);

    res.status(200).json({
      deleted: deleted[0],
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  };
};

/** Guruhdagi o'quvchilarni ko'rish
 * Post groups_students
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getGroupsStudents = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db('groups_students')
      .leftJoin('groups', 'groups_students.group_id', 'groups.id')
      .leftJoin('students', 'groups_students.student_id', ' students.id')
      .select('groups.name as group',
      db.raw("CONCAT(students.first_name, ' ', students.last_name) as student"))
      .where({ 'groups_students.group_id': id });

    if(result.length === 0) {
      return res.status(400).json({
        error: `IDsi ${id} ga teng bo'lgan guruh mavjud emas`
      });
    };

    res.status(200).json({
      result
    })
  } catch (error) {
    res.status(500).json({
      error
    });
  };
};

module.exports = {
  postGroupsStudents,
  deleteGroupsStudents,
  getGroupsStudents
};