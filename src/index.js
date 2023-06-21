const express = require('express');
const config = require('./shared/config')
const { errorMiddlewareFunc } = require('./shared/errors');
const stuffRoutes = require('./routes/stuff');
const studentsRoutes = require('./routes/student');
const groupsRoutes = require('./routes/groups');
const directionsRoutes = require('./routes/directions');


const app = express();

app.use(express.json());

app.use(stuffRoutes);
app.use(studentsRoutes);
app.use(groupsRoutes);
app.use(directionsRoutes);

app.use(errorMiddlewareFunc);


const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlayapti`);
});
