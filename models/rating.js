const pool = require('../db');
const Student = require('./student');
const table = 'rating';
const assignmentTable = 'assignment';

/**
 * Rating
 *
 * This class represents a Rating
 *
 * @author Giannandrea Vicidomini, Marco D'Antonio
 * @version 1.0
 *
 * 2019 - Copyright by Gang Of Four Eyes
 */
class Rating {
  /**
  * @param {Rating} rating object contructor
  */
  constructor(rating) {
    this.student = rating.student == null ? null : new Student(rating.student);
    this.assignment_id = rating.assignment_id;
    this.titles_score = rating.titles_score;
    this.interview_score = rating.interview_score;
  }

  /**
   * @param {Rating} rating The ratind to create
   * @return {Promise<Rating>} Promise representing the fulfillment of Rating creation
   */
  static async create(rating) {
    if (rating == null) {
      throw new Error('The rating must not be null');
    }

    const student = JSON.parse(JSON.stringify(rating.student));

    rating.student = rating.student.email;

    return pool.query(`INSERT INTO ${table} SET ?`, rating)
        .then(([resultSetHeader]) => {
          rating.student = student;

          return new Rating(rating);
        })
        .catch((err) => {
          throw err;
        });
  }

  /**
   * @param {Rating} rating The rating to update
   * @return {Promise<Rating>} Promise representing the fulfillment of Rating update
   */
  static async update(rating) {
    if (rating == null) {
      throw new Error('The rating must not be null');
    }
    if (!await this.exists(rating)) {
      throw new Error('The rating doesn\'t exists');
    }

    const student = JSON.parse(JSON.stringify(rating.student));

    rating.student = rating.student.email;


    return pool.query(`UPDATE ${table} SET ? WHERE student=? AND assignment_id=?`, [rating, rating.student, rating.assignment_id])
        .then(([resultSetHeader]) => {
          rating.student = student;

          return new Rating(rating);
        })
        .catch((err) => {
          throw err;
        });
  }

  /**
   * @param {Rating} rating The rating to remove
   * @return {Promise<Rating>} Promise representing the fulfillment of Rating removal
   */
  static async remove(rating) {
    if (rating == null) {
      throw new Error('The rating must not be null');
    }

    return pool.query(`DELETE FROM ${table} WHERE student=? AND assignment_id=?`, [rating.student.email, rating.assignment_id])
        .then(([resultSetHeader]) => {
          return resultSetHeader.affectedRows > 0;
        })
        .catch((err) => {
          throw err;
        });
  }

  /**
   * @param {Rating} rating The rating whose existence is checked
   * @return {Promise<boolean>} Promise representing the fulfillment of Rating existence check
   */
  static async exists(rating) {
    if (rating == null) {
      throw new Error('The rating must not be null');
    }

    return pool.query(`SELECT * FROM ${table} WHERE student=? AND assignment_id=?`, [rating.student.email, rating.assignment_id])
        .then(([rows]) => {
          return rows.length > 0;
        })
        .catch((err) => {
          throw err;
        });
  }

  /**
   * @param {String} emailStudent The student email
   * @param {String} assignmentId The assignment id
   * @return {Promise<Rating>} Promise representing the fulfillment of Rating search
   */
  static async findById(emailStudent, assignmentId) {
    if (emailStudent == null || assignmentId == null) {
      throw new Error('Student email and assignment id must be both valid');
    }

    return pool.query(`SELECT * FROM ${table} WHERE student=? AND assignment_id=?`, [emailStudent, assignmentId])
        .then(([rows]) => {
          if (rows.length < 1) {
            throw new Error('No result was found');
          }
          const rating = rows[0];

          return Student.findByEmail(rating.student)
              .then((student) => {
                rating.student = student;

                return new Rating(rating);
              });
        })
        .catch((err) => {
          throw err;
        });
  }

  /**
   * @param {String} emailStudent The student email
   * @return {Promise<Rating[]>} Promise representing the fulfillment of Rating search
   */
  static async findByStudent(emailStudent) {
    if (emailStudent == null) {
      throw new Error('The student email must not be null');
    }

    return Student.findByEmail(emailStudent)
        .then((student) => {
          return pool.query(`SELECT * FROM ${table} WHERE student=?`, emailStudent)
              .then(([rows]) => {
                return rows.map((rating) => {
                  rating.student = student;

                  return new Rating(rating);
                });
              });
        })
        .catch((err) => {
          throw err;
        });
  }

  /**
   * @param {String} assignmentId The student email
   * @return {Promise<Rating[]>} Promise representing the fulfillment of Rating search
   */
  static async findByAssignment(assignmentId) {
    if (assignmentId == null) {
      throw new Error('The assignment id must not be null');
    }

    return pool.query(`SELECT * FROM ${table} WHERE assignment_id=?`, assignmentId)
        .then(([rows]) => {
          return Promise.all(rows.map((rating) =>
            Student.findByEmail(rating.student)
                .then((student) => {
                  rating.student = student;

                  return new Rating(rating);
                }),
          ))
              .catch((err) => {
                throw err;
              });
        })
        .catch((err) => {
          throw err;
        });
  }

  /**
   * @param {String} noticeProcol The notice protocol
   * @return {Promise<Rating[]>} Promise representing the fulfillment of Rating search
   */
  static async findByProtocol(noticeProcol) {
    if (noticeProcol == null) {
      throw new Error('The notice protocol must not be null');
    }

    return pool
        .query(
            `SELECT ${table}.student AS student, ${table}.assignment_id AS assignment_id, ${table}.titles_score AS titles_score, ${table}.interview_score AS interview_score FROM ${table} JOIN ${assignmentTable} ON ${table}.assignment_id = ${assignmentTable}.id WHERE ${assignmentTable}.notice_protocol = ?`,
            noticeProcol,
        )
        .then(([rows]) => {
          return Promise.all(rows.map((rating) =>
            Student.findByEmail(rating.student)
                .then((student) => {
                  rating.student = student;

                  return new Rating(rating);
                }),
          ))
              .catch((err) => {
                throw err;
              });
        })
        .catch((err) => {
          throw err;
        });
  }
}

module.exports = Rating;

