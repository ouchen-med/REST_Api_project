const { Router } = require('express');
const controllerStudents = require('./controller');

const router = Router();

router.get('/', controllerStudents.getStudents);
router.get('/:id',controllerStudents.getStudentById)

module.exports = router;
