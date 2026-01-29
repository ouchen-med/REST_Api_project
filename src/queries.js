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
    
  `
};

module.exports = queries;