const { body } = require('express-validator');
const pool = require('../bd');
const queries = require('./queries');

const studentValidation = () => {
  return [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
      .escape(),
    
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail()
      .custom(async (email) => {
        try {
          const result = await pool.query(queries.checkEmailExists, [email]);
          if (result.rows.length > 0) {
            throw new Error('Email already exists');
          }
        } catch (error) {
          throw new Error('Error checking email availability');
        }
      }),
    
    body('number')
      .trim()
      .notEmpty().withMessage('Number is required')
      .matches(/^\d{10}$/).withMessage('Number must be exactly 10 digits')
      .isLength({ min: 10, max: 10 }).withMessage('Number must be exactly 10 digits')
  ];
};

module.exports = studentValidation;