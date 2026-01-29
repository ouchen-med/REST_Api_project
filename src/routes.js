const { Router } = require('express');
const controllerStudents = require('./controller');
const validationStudents = require('./validationSchema');

const router = Router();

// Apply validation to all student routes that need it
router.get('/', controllerStudents.getStudents);
router.get('/:id', controllerStudents.getStudentById);
router.post('/', validationStudents(), controllerStudents.addStudent);

// 404 handler for student routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Route error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = router;