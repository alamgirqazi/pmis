const projectsController = {};
const Projects = require("../models/projects.model");

projectsController.getAll = async (req, res) => {
    let projects;
    try {
        const {
            start,
            length,
            search
        } = req.query
        
        // const {
        //     value
        // } = JSON.parse(search)

        let obj = {}
        // if (value != '') {

        //     obj = {
        //         $text: {
        //             $search: value
        //         },
        //     }
        // }

        projects = await Projects.paginate(obj, {
            offset: parseInt(start),
            limit: parseInt(length)
        });
        res.status(200).send({
            code: 200,
            message: 'Successful',
            data: projects
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};
projectsController.addProject = async (req, res) => {
    // const max_result = await Projects.aggregate([
    //     { $group: { _id: null, max: { $max: { $toInt: '$id' } } } }
    //   ]);
    //   let body = req.body;
    //   if (max_result.length > 0) {
    //     body['id'] = max_result[0].max + 1;
    //   } else {
    //     body['id'] = 1;
    //   }

    Projects.create(req.body, function (err, result) {
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


projectsController.projectsStatistics = async (req, res) => {
    
    try {
   
        const Location = await  Projects.aggregate(
            [ {$group : { _id : '$Location', count : {$sum : 1}}} ]
        )
        const Role = await  Projects.aggregate(
            [ {$group : { _id : '$Role', count : {$sum : 1}}} ]
        )
        const Date_added = await  Projects.aggregate(
            [ {$group : { _id : '$Date_added', count : {$sum : 1}}} ]
        )

responseObj = {

    Location,Role,Date_added
}

        res.status(200).send({
            code: 200,
            message: "Stats",
            data: responseObj
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};

projectsController.getNextId = async (req, res) => {
    try {
  
      const max_result = await Projects.aggregate([
        { $group: { _id: null, max: { $max: { $toInt: '$id' } } } }
      ]);
  
      let nextId;
      if (max_result.length > 0) {
        nextId = max_result[0].max + 1;
      } else {
        nextId = 1;
      }
    
      var data = {
        code: 200,
        data: { id: nextId}
      };
      res.status(200).send(data);
    } catch (error) {
      console.log('error', error);
      return res.status(500).send(error);
    }
  };
projectsController.getObjectivesOfUser = async (req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Projects.find({
            "users._id": _id
        });
        // this query workedd
    //   const result = await Inventory.updateOne({
    //         _id: _id
    //     }, {
    //         $set: {is_deleted: 1}
    //     }, {
    //         upsert: true,
    //         runValidators: true
    //     });
        res.status(200).send({
            code: 200,
            data:result
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
  };

projectsController.deleteProject = async (req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Projects.findOneAndDelete({
            _id: _id
        });
    //   const result = await Inventory.updateOne({
    //         _id: _id
    //     }, {
    //         $set: {is_deleted: 1}
    //     }, {
    //         upsert: true,
    //         runValidators: true
    //     });
        res.status(200).send({
            code: 200,
            message: "Deleted Successfully"
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};

projectsController.updateProject = async (req, res) => {
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
        const result = await Projects.updateOne({
            _id: _id
        }, {
            $set: updates
        }, {
            upsert: true,
            runValidators: true
        });


        {
            if (result.nModified == 1) {
                res.status(200).send({
                    code: 200,
                    message: "Updated Successfully"
                });
            } else if (result.upserted) {
                res.status(200).send({
                    code: 200,
                    message: "Created Successfully"
                });
            } else {
                res
                    .status(422)
                    .send({
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

module.exports = projectsController;