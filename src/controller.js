const pool = require('../bd'); 
const queries = require('./queries')

const getStudents = (req, res) => {
  pool.query(queries.getStudentsQuerie, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result.rows);
  });
};

const getStudentById = (req,res) => {
  const Id = Number(req.params.id);
  pool.query(queries.getStudentsByIdQuerie, [Id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  })
}

module.exports = {
  getStudents,
  getStudentById,
};
