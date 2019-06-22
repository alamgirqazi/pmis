const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const errorHandler = require("./middleware/error-handler");
const errorMessage = require("./middleware/error-message");
const accessControls = require("./middleware/access-controls");
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  const checkAuth = require('./middleware/check-auth.js');

  app.use(bodyParser.json()); // to support JSON-encoded bodies
  
// Requiring Routes

// const assetsRoutes = require('./routes/assets.routes');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const projectsRoutes = require('./routes/projects.routes');
const objectivesRoutes = require('./routes/objectives.routes');
const activitiesRoutes = require('./routes/activities.routes');
// const tasksRoutes = require('./routes/tasks.routes');
// const inventoryRoutes = require('./routes/inventory.routes');

// config mongodb
const mongoCon = 'mongodb://localhost:27017/pmis-db';

// mongoose.connect(mongoCon);
mongoose.connect(mongoCon,{ useNewUrlParser: true,useCreateIndex: true });


const fs = require('fs');
fs.readdirSync(__dirname + "/models").forEach(function(file) {
    require(__dirname + "/models/" + file);
});

app.use('/images', express.static(path.join(__dirname, 'uploads')))

app.get('/',  function (req, res) {
  res.status(200).send({
    message: 'backend server'});
});

app.set('port', (3000));

app.use(accessControls);
app.use(cors());

// Routes which should handle requests
// checkAuth
// app.use("/assets",assetsRoutes);
// checkAuth
app.use("/users",usersRoutes);
app.use("/projects",projectsRoutes);
app.use("/objectives",objectivesRoutes);
app.use("/activities",activitiesRoutes);
// app.use("/tasks",tasksRoutes);
// checkAuth
// app.use("/inventory",inventoryRoutes);
app.use("/auth",authRoutes);

app.use(errorHandler);

app.use(errorMessage);

// for PROD
// server.listen(app.get('port'),'115.186.156.98');

// for dev
server.listen(app.get('port'));
console.log('listening on port',app.get('port'));
