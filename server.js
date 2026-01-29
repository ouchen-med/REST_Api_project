const express = require('express');
require('dotenv').config(); 
const app = express();
const port = 3000;
app.use(express.json());
const studentsRoutes = require('./src/routes');
app.use('/api/students', studentsRoutes);




app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
