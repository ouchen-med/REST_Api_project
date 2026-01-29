const pool = require('../bd'); 
const queries = require('./queries')
const {validationResult} = require ('express-validator')

const getStudents = (req, res) => {
  pool.query(queries.getStudentsQuerie, (err, result) => {
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  });
};

const getStudentById = (req, res) => {
  const id = parseInt(req.params.id);
  
  //  ID
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }

  pool.query(queries.getStudentsByIdQuerie, [id], (error, results) => {
    if (error) {
      console.error('Error fetching student by ID:', error);
      return res.status(500).json({ error: 'Failed to fetch student' });
    }
    
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.status(200).json({
      success: true,
      data: results.rows[0]
    });
  });
};

const addStudent = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  const { name, email, number } = req.body;

  // Check if email exists
  pool.query(queries.checkEmailExists, [email], (error, results) => {
    if (error) {
      console.error('Error checking email:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Database error' 
      });
    }
    
    if (results.rows.length) {
      return res.status(409).json({  // 409 Conflict is better for duplicate resources
        success: false,
        error: 'Email already exists!'
      });
    }

    // Add new student
    pool.query(queries.addStudentQuery, [name, email, number], (error, results) => {
      if (error) {
        console.error('Error adding student:', error);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to add student' 
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Student added successfully!',
        student: {
          id: results.rows[0]?.id || null, 
          name,
          email,
          number
        }
      });
    });
  });
};
const updateStudent = (req, res) => {
  const id = parseInt(req.params.id);

  // Validate ID
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid student ID' 
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const { name, email, number } = req.body;

  //  check if student exists
  pool.query(queries.getStudentsByIdQuerie, [id], (error, results) => {
    if (error) {
      console.error('Error checking student existence:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Database error' 
      });
    }
    
    if (results.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }

    const currentStudent = results.rows[0];
    
    // Check if email is being changed and if new email already exists (excluding current student)
    if (email && email !== currentStudent.email) {
      pool.query(queries.checkEmailExists, [email], (emailError, emailResults) => {
        if (emailError) {
          console.error('Error checking email:', emailError);
          return res.status(500).json({ 
            success: false, 
            error: 'Error checking email availability' 
          });
        }
        
        if (emailResults.rows.length > 0) {
          return res.status(409).json({ 
            success: false, 
            error: 'Email already exists' 
          });
        }
        
        
        performUpdate();
      });
    } else {
      // No email change needed, proceed directly
      performUpdate();
    }

    function performUpdate() {
      // Use provided values or keep existing ones
      const updatedName = name || currentStudent.name;
      const updatedEmail = email || currentStudent.email;
      const updatedNumber = number || currentStudent.number;

      pool.query(
        queries.updateStudentQuerie, 
        [updatedName, updatedEmail, updatedNumber, id], 
        (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating student:', updateError);
            return res.status(500).json({ 
              success: false, 
              error: 'Failed to update student' 
            });
          }
          
          res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: updateResults.rows[0]
          });
        }
      );
    }
  });
};
const deleteStudent = (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid student ID' 
    });
  }

  pool.query(queries.getStudentsByIdQuerie, [id], (error, results) => {
    if (error) {
      console.error('Error fetching student by ID:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to fetch student' 
      });
    }
    
    if (results.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Student not found' 
      });
    }
    
    pool.query(queries.deleteStudentQuery, [id], (deleteError, deleteResults) => {
      if (deleteError) {
        console.error('Error deleting student:', deleteError);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to delete student' 
        });
      }

      res.status(200).json({
        success: true,
        message: 'Student deleted successfully!',
        student: deleteResults.rows[0]  
      });
    });
  });
};


module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
};