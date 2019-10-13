const objectivesController = {};
const Objectives = require('../models/objectives.model');
const Projects = require('../models/projects.model');
const Activities = require('../models/activities.model');
const Tasks = require('../models/tasks.model');

objectivesController.getAll = async (req, res) => {
  try {
    const { start, length, user_id, project_id } = req.query;

    // const {
    //     value
    // } = JSON.parse(search)

    let obj = {};
    let merged = {};
    let user_query = {};
    let project_query = {};
    // if (value != '') {

    //     obj = {
    //         $text: {
    //             $search: value
    //         },
    //     }
    // }
    if (user_id != '' && user_id !== undefined) {
      user_query = {
        'users_assigned._id': user_id
      };
    }
    if (project_id != '' && project_id !== undefined) {
      project_query = {
        project_id: project_id
      };
    }

    merged = { ...obj, ...user_query, ...project_query };
 

    let objectives = await Objectives.paginate(merged, {
      offset: parseInt(start),
      limit: parseInt(length)
    });

    let response_object = JSON.parse(JSON.stringify(objectives));

    for (let [index, iterator] of response_object.docs.entries()) {
      const res = await Projects.findOne({ _id: iterator.project_id });
      response_object.docs[index].project_detail = res;
      const res2 =  await Activities.find({ objective_id: iterator._id });
      response_object.docs[index].activity_detail = res2;
      const res3 = await Tasks.find({ objective_id: iterator._id });
      response_object.docs[index].task_detail = res3;


    }

    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: response_object
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

objectivesController.updateAttachment = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.params._id;

    const body = req.body;

    let final_attachments = JSON.parse(body.attachments);
    
    delete body['attachments']
    delete body['file']
    const filePath = `images/attachments/${req.params._id}/`;

    const attachment = {
      ...body,
      date: Date.now(),
      filePath: filePath
    }
    if(final_attachments){
      final_attachments = [attachment,...final_attachments]

    }
else {
  final_attachments = []
final_attachments.push(attachment)
}
const updates = {
  attachments: final_attachments
}
    runUpdate(body.objective_id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};


objectivesController.addObjective = async (req, res) => {
  // const max_result = await objectives.aggregate([
  //     { $group: { _id: null, max: { $max: { $toInt: '$id' } } } }
  //   ]);
  //   let body = req.body;
  //   if (max_result.length > 0) {
  //     body['id'] = max_result[0].max + 1;
  //   } else {
  //     body['id'] = 1;
  //   }

  Objectives.create(req.body, function(err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      var data = {
        code: 200,
        message: 'Data inserted successfully',
        data: result
      };
      res.status(200).send(data);
    }
  });
};
objectivesController.addManyObjectives = async (req, res) => {
  try {
    const objectives = req.body.objectives;
    const project_id = req.body.project_id;
    objectives.forEach(async (element, index) => {
      element.project_id = project_id;
      if (element._id == '') {
        delete element._id;

        // save single
        await Objectives.create(element);
      } else {
        await Objectives.updateOne(
          {
            _id: element._id
          },
          {
            $set: element
          },
          {
            upsert: true,
            runValidators: true
          }
        );
      }

      if (index == objectives.length - 1) {
        var data = {
          code: 200,
          message: 'Data inserted successfully'
        };
        res.status(200).send(data);
      }
    });
  } catch (ex) {
    res.status(500).send(ex);
  }
};

objectivesController.deleteObjective = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.params._id;

    const result = await Objectives.findOneAndDelete({
      _id: _id
    });

    res.status(200).send({
      code: 200,
      message: 'Deleted Successfully'
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

objectivesController.updateObjective = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.params._id;
    let updates = req.body;

    runUpdate(_id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

async function runUpdate(_id, updates, res) {
  try {
    const result = await Objectives.updateOne(
      {
        _id: _id
      },
      {
        $set: updates
      },
      {
        upsert: true,
        runValidators: true
      }
    );

    {
      if (result.nModified == 1) {
        res.status(200).send({
          code: 200,
          message: 'Updated Successfully'
        });
      } else if (result.upserted) {
        res.status(200).send({
          code: 200,
          message: 'Created Successfully'
        });
      } else {
        res.status(422).send({
          code: 422,
          message: 'Unprocessible Entity'
        });
      }
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
}

module.exports = objectivesController;
