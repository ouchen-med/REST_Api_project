const { Router } = require('express');
const controllerStudents = require('./controller');
const validationStudents = require('./validationSchema');

const router = Router();

router.get('/', controllerStudents.getStudents);
router.get('/:id', controllerStudents.getStudentById);
router.post('/', validationStudents(), controllerStudents.addStudent);
router.patch('/:id', controllerStudents.updateStudent)


router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

router.use((error, req, res, next) => {
  console.error('Route error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = router;