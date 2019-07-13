const statisticsController = {};
const Objectives = require('../models/tasks.model');
const Projects = require('../models/projects.model');
const Activities = require('../models/activities.model');
const Tasks = require('../models/tasks.model');

statisticsController.getAllStatistics = async (req, res) => {
  try {
    let query = {};
    if (req.query.completeonly) {
      query = { status: { $ne: 'complete' } };
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
statisticsController.getAllProjectsStatistics = async (req, res) => {
  try {
    const complete = await Projects.count({ status: 'complete' });
    const hold = await Projects.count({ status: 'hold' });
    const pending = await Projects.count({ status: 'pending' });
    const cancelled = await Projects.count({ status: 'cancelled' });

    responseObj = {
      complete,
      hold,
      pending,
      cancelled
    };

    res.status(200).send({
      code: 200,
      message: 'getAllProjectsStatistics',
      data: responseObj
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
statisticsController.getAllObjectivesStatistics = async (req, res) => {
  try {
    const complete = await Objectives.count({ status: 'complete' });
    const hold = await Objectives.count({ status: 'hold' });
    const pending = await Objectives.count({ status: 'pending' });
    const cancelled = await Objectives.count({
      status: 'cancelled'
    });

    responseObj = {
      complete,
      hold,
      pending,
      cancelled
    };

    res.status(200).send({
      code: 200,
      message: 'getAllObjectivesStatistics',
      data: responseObj
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

statisticsController.getAllActivitiesStatistics = async (req, res) => {
  try {
    const complete = await Activities.count({ status: 'complete' });
    const hold = await Activities.count({ status: 'hold' });
    const pending = await Activities.count({ status: 'pending' });
    const cancelled = await Activities.count({
      status: 'cancelled'
    });

    responseObj = {
      complete,
      hold,
      pending,
      cancelled
    };

    res.status(200).send({
      code: 200,
      message: 'getAllActivitiesStatistics',
      data: responseObj
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

statisticsController.getAllTasksStatistics = async (req, res) => {
  try {
    const complete = await Tasks.count({ status: 'complete' });
    const hold = await Tasks.count({ status: 'hold' });
    const pending = await Tasks.count({ status: 'pending' });
    const cancelled = await Tasks.count({ status: 'cancelled' });

    responseObj = {
      complete,
      hold,
      pending,
      cancelled
    };

    res.status(200).send({
      code: 200,
      message: 'getAllTasksStatistics',
      data: responseObj
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

module.exports = statisticsController;
