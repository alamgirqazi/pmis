const statisticsController = {};
const Objectives = require('../models/tasks.model');
const Projects = require('../models/projects.model');
const Activities = require('../models/activities.model');
const Tasks = require('../models/tasks.model');
const Users = require('../models/user.model');

statisticsController.getAllStatistics = async (req, res) => {
  try {
    let query = { status: { $ne: 'complete' } };
    let incomplete_query = { status:'complete' };
    // if (req.query.completeonly) {
    //   query = { status: { $ne: 'complete' } };
    // }


    const projects_all = await Projects.count();
    const projects_complete = await Projects.count(query);
    const projects_incomplete = await Projects.count(incomplete_query);
    
    const projects = {
      all: projects_all,
      complete: projects_complete,
      incomplete: projects_incomplete
    }

    const Objectives_all = await Objectives.count();
    const Objectives_complete = await Objectives.count(query);
    const Objectives_incomplete = await Objectives.count(incomplete_query);

    const objectives = {
      all: Objectives_all,
      complete: Objectives_complete,
      incomplete: Objectives_incomplete
    }

    const Activities_all = await Activities.count();
    const Activities_complete = await Activities.count(query);
    const Activities_incomplete = await Activities.count(incomplete_query);

    const activities = {
      all: Activities_all,
      complete: Activities_complete,
      incomplete: Activities_incomplete
    }
  
    const Tasks_all = await Tasks.count();
    const Tasks_complete = await Tasks.count(query);
    const Tasks_incomplete = await Tasks.count(incomplete_query);

    const tasks = {
      all: Tasks_all,
      complete: Tasks_complete,
      incomplete: Tasks_incomplete
    }

    // const objectives = await Objectives.count();

    // const activities = await Activities.count();
    // const tasks = await Tasks.count();

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
statisticsController.getAllUsersStatistics = async (req, res) => {
  try {
    const ed = await Users.count({ role: 'Chief Executive Officer' });
    const md = await Users.count({ role: 'Chief Operating Officer' });
    const pm = await Users.count({ role: 'Managers' });
    const pc = await Users.count({ role: 'Project Managers' });
    const official = await Users.count({ role: 'Project Coordinators / Officers'});
    users = {
      ed,md,pm,pc,official

    }

    responseObj = {
      users
    };

    res.status(200).send({
      code: 200,
      message: 'getAllUsersStatistics',
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
