const statisticsController = {};
const Objectives = require('../models/tasks.model');
const Projects = require("../models/projects.model");
const Activities = require("../models/activities.model");
const Tasks = require("../models/tasks.model");

statisticsController.getAllStatistics = async (req, res) => {
  try {

    let query = {}
    if(req.query.completeonly){
      query = {"status" : { "$ne": 'complete'}} ;

    }
    
    const projects = await Projects.count(query);
    const objectives = await Objectives.count(query);

    const activities = await Activities.count(query);
    const tasks = await Tasks.count();

    responseObj = {
      projects,
      objectives,
      activities,
      tasks
    };

    res.status(200).send({
      code: 200,
      message: 'getAllStatistics',
      data: responseObj
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

module.exports = statisticsController;
