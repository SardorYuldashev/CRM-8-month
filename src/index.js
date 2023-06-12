const express = require('express');
const config = require('./shared/config')
const stuffRoutes = require('./routes/stuff');
const studentsRoutes = require('./routes/student');

const app = express();

app.use(express.json());

app.use(stuffRoutes);
app.use(studentsRoutes);


const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlayapti`);
});
