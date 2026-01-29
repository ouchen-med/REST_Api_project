const getStudentsQuerie = 'SELECT * FROM students';
const getStudentsByIdQuerie = 'SELECT * FROM students WHERE id = $1'

module.exports = {
    getStudentsQuerie,
    getStudentsByIdQuerie,
}

