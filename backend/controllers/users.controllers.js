const usersController = {};
const Users = require("../models/user.model");
const Objectives = require("../models/objectives.model");
const Tasks = require("../models/tasks.model");
const Activities = require('../models/activities.model');
const path = require('path');
usersController.getAll = async (req, res) => {
    let users;
    try {
        const {
            start,
            length,
            search,
            user_type
        } = req.query
        const {
            value
        } = JSON.parse(search)

        let obj = {}
        if (value != '') {

            obj = {
                $text: {
                    $search: value
                },
            }
        }
            let user_type_obj = {};
    if (user_type != '' && user_type) {
        user_type_obj = { role: user_type };
    }


    let merged = {...obj,...user_type_obj};
    

        users = await Users.paginate(merged,{      password: 0}, {
             password: 0,
            offset: parseInt(start),
            limit: parseInt(length)
        });
        res.status(200).send({
            code: 200,
            message: 'Successful',
            data: users
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};
usersController.getAllStatistics = async (req, res) => {
    let users;
    try {

        users = await Users.paginate({},{      password: 0}, {
             password: 0,
            offset: 0,
            limit:100
        });

        let response_object = JSON.parse(JSON.stringify(users));

        for (let[index, iterator] of response_object.docs.entries()) {
   
            const objectives =  await Objectives.find({ "users_assigned._id": iterator._id });
            const tasks =  await Tasks.find({ "users_assigned._id": iterator._id });
            const activities =  await Activities.find({ "users_assigned._id": iterator._id });
            
             response_object.docs[index].objectives = objectives;
             response_object.docs[index].activities = activities;
             response_object.docs[index].tasks = tasks;
       
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
usersController.getSingleUser = async (req, res) => {
    let user;
    try {
        const _id = req.params._id
        user = await Users.findOne({"_id":_id });
        res.status(200).send({
            code: 200,
            message: 'Successful',
            data: user
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};
usersController.addUser = async (req, res) => {

    Users.create(req.body, function (err, result) {
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


usersController.getNextId = async (req, res) => {
    try {
      const max_result = await Users.aggregate([
        { $group: { _id: null, max: { $max: '$id' } } }
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


usersController.deleteUser = async (req, res) => {
    if (!req.params._id) {Fu
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Users.findOneAndDelete({
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
usersController.uploadAvatar = async (req, res) => {
    try {
const filePath = `images/avatar/avatar-${req.params.id}`;
const ext = path.extname(req.file.originalname);
const updates = {
    avatar: filePath,
    avatar_ext: ext 
}
runUpdateById(req.params.id,updates,res);
    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
    
};
usersController.updateUser = async (req, res) => {
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
        const result = await Users.updateOne({
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
async function runUpdateById(id, updates, res) {

    try {
        const result = await Users.updateOne({
            id: id
        }, {
            $set: updates
        }, {
            upsert: true,
            runValidators: true
        });


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

                {
                    res.status(200).send({
                        code: 200,
                        message: "Task completed successfully"
                    });
                }
            //     res
            //         .status(422)
            //         .send({
            //             code: 422,
            //             message: 'Unprocessible Entity'
            //         });
            // }
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
}

module.exports = usersController;