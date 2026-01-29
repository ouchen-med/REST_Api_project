const queries = {
  getStudentsQuerie: `
    SELECT id, name, email, number
    FROM students 
   
  `,
  
  getStudentsByIdQuerie: `
    SELECT id, name, email, number 
    FROM students 
    WHERE id = $1
  `,
  
  checkEmailExists: `
    SELECT email FROM students WHERE email = $1
  `,
  
  addStudentQuery: `
    INSERT INTO students (name, email, number) 
    VALUES ($1, $2, $3) 
    
  `,
   updateStudentQuerie: `
   UPDATE students 
SET 
  name = COALESCE($1, name),
  email = COALESCE($2, email),
  number = COALESCE($3, number)
WHERE id = $4
RETURNING *;

     
  `,
  
  checkEmailExistsExcludingCurrent: `
    SELECT email FROM students WHERE email = $1 AND id != $2
  `
};

module.exports = queries;