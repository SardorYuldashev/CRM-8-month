const express = require('express');
const db = require('../../db');

/**
 * Guruh yaratish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const postGroup = async (req, res) => {
  try {
    const { name, teacher_id, assistent_teacher_id, direction_id } = req.body;

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

    const result = await db('groups').insert({ name, teacher_id, assistent_teacher_id, direction_id }).returning('*');

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
    const { name, direction_id, teacher, offset = 0, limit = 5, sort_by = 'id', sort_order = 'desc' } = req.query;

    const dbQuery = db('groups')
      .leftJoin('stuff as stuff_teacher', 'stuff_teacher.id', 'groups.teacher_id')
      .leftJoin('stuff as stuff_assistent', 'stuff_assistent.id', 'groups.assistent_teacher_id')
      .leftJoin('directions', 'groups.direction_id', 'directions.id')
      .select(
        'groups.id',
        'groups.name',
        'directions.name as direction',
        db.raw(`
          CASE WHEN stuff_teacher.id IS NULL THEN NULL
          ELSE
          CONCAT(stuff_teacher.first_name, ' ', stuff_teacher.last_name) END as teacher
        `),
        db.raw(`
          CASE WHEN stuff_assistent.id IS NULL THEN NULL
          ELSE
          CONCAT(stuff_assistent.first_name, ' ', stuff_assistent.last_name) END as assistent
        `),
      )
      .groupBy('groups.id', 'stuff_teacher.id', 'stuff_assistent.id', 'directions.id');

    if (name) {
      dbQuery.andWhereILike('name', `%${name}%`);
    };

    if (teacher) {
      dbQuery.andWhereILike('stuff_teacher.first_name', `%${teacher}%`).orWhereILike('stuff_teacher.last_name', `%${teacher}%`);
    };

    if (direction_id) {
      dbQuery.andWhere({direction_id});
    };

    const total = await dbQuery.clone().count().groupBy('groups.id', 'stuff_teacher.id', 'stuff_assistent.id');

    dbQuery.orderBy(sort_by, sort_order);

    dbQuery.limit(limit).offset(offset);

    const group = await dbQuery;

    res.status(200).json({
      group,
      pageInfo: {
        total: total.length,
        offset,
        limit,
      }
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
      .leftJoin('groups_students', 'groups_students.group_id', 'groups.id')
      .leftJoin('directions', 'groups.direction_id', 'directions.id')
      .leftJoin('students', 'groups_students.student_id', 'students.id')
      .select(
        'groups.id',
        'groups.name',
        // 'directions.name as direction',
        db.raw(`
          CASE WHEN directions.id IS NULL THEN NULL
          ELSE
          json_build_object(
            'id', directions.id,
            'name', directions.name
          ) END as direction
        `),
        db.raw(`
        CASE WHEN stuff_teacher.id IS NULL THEN NULL
        ELSE
        json_build_object(
          'id', stuff_teacher.id,
          'first_name', stuff_teacher.first_name,
          'last_name', stuff_teacher.last_name,
          'username', stuff_teacher.username
        ) END as teacher
        `),
        db.raw(`
        CASE WHEN stuff_assistent.id IS NULL THEN NULL
        ELSE
        json_build_object(
          'id', stuff_assistent.id,
          'first_name', stuff_assistent.first_name,
          'last_name', stuff_assistent.last_name,
          'username', stuff_assistent.username
        ) END as assistent
        `),
        db.raw(`
          CASE WHEN students.id IS NULL THEN '[]'
          ELSE
          json_agg(json_build_object(
              'id', students.id,
              'first_name', students.first_name,
              'last_name', students.last_name
            )) END as students
        `)
      )
      .where({ 'groups.id': id })
      .groupBy('groups.id', 'stuff_teacher.id', 'stuff_assistent.id', 'students.id', 'directions.id')
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
 * Student qo'shish
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

/**
 * Studentni guruhdan o'chirish
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const removeFromGroup = async (req, res) => {
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
      error
    });
  };
};

/** Guruhdagi o'quvchilarni ko'rish
 * Post groups_students
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getListStudentsOfGroup = async (req, res) => {
  try {
    const { offset = 0, limit = 5, sort_order = 'desc' } = req.query;

    const { id } = req.params;

    const dbQuery = db('groups_students')
      .leftJoin('groups', 'groups_students.group_id', 'groups.id')
      .leftJoin('students', 'groups_students.student_id', 'students.id')
      .select('groups.name as group',
        db.raw("CONCAT(students.first_name, ' ', students.last_name) as student"))
      .where({ 'groups_students.group_id': id })
      .groupBy('groups_students.id', 'groups.id', 'students.id');


    const total = await dbQuery.clone().count().groupBy('groups_students.id', 'groups.id', 'students.id');

    dbQuery.orderBy('student', sort_order);

    dbQuery.limit(limit).offset(offset);


    const result = await dbQuery;

    if (result.length === 0) {
      return res.status(400).json({
        error: `IDsi ${id} ga teng bo'lgan guruh mavjud emas`
      });
    };

    res.status(200).json({
      result,
      pageInfo: {
        total: total.length,
        offset,
        limit,
      }
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
  addStudent,
  removeFromGroup,
  getListStudentsOfGroup
};















// const getListStudentsOfGroup = async (req, res) => {
//   try {
//     const { group, student, offset = 0, limit = 5, sort_by = 'id', sort_order = 'desc' } = req.query;

//     const { id } = req.params;

//     const result = await db('groups_students')
//       .leftJoin('groups', 'groups_students.group_id', 'groups.id')
//       .leftJoin('students', 'groups_students.student_id', ' students.id')
//       .select('groups.name as group',
//       db.raw("CONCAT(students.first_name, ' ', students.last_name) as student"))
//       .where({ 'groups_students.group_id': id });

//     if(result.length === 0) {
//       return res.status(400).json({
//         error: `IDsi ${id} ga teng bo'lgan guruh mavjud emas`
//       });
//     };

//     res.status(200).json({
//       result
//     })
//   } catch (error) {
//     res.status(500).json({
//       error
//     });
//   };
// };