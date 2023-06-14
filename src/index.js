const express = require('express');
const config = require('./shared/config')
const stuffRoutes = require('./routes/stuff');
const studentsRoutes = require('./routes/student');
const groupsRoutes = require('./routes/groups');

const app = express();

app.use(express.json());

app.use(stuffRoutes);
app.use(studentsRoutes);
app.use(groupsRoutes);


const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlayapti`);
});
