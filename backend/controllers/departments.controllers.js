const departmentsController = {};
const Departments = require("../models/departments.model");

departmentsController.getAll = async (req, res) => {
    let departments;
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
    

        departments = await Departments.paginate(merged,{
            offset: parseInt(start),
            limit: parseInt(length)
        });
        res.status(200).send({
            code: 200,
            message: 'Successful',
            data: departments
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};
departmentsController.getAllDepartments = async (req, res) => {
    let departments;
    try {
      

        departments = await Departments.find();
        res.status(200).send({
            code: 200,
            message: 'Successful',
            data: departments
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};

departmentsController.getSingleDepartment = async (req, res) => {
    let user;
    try {
        const _id = req.params._id
        user = await Departments.findOne({"_id":_id });
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
departmentsController.addDepartment = async (req, res) => {

    Departments.create(req.body, function (err, result) {
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


departmentsController.getNextId = async (req, res) => {
    try {
      const max_result = await Departments.aggregate([
        { $group: { _id: null, max: { $max:'$id' } } }
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


departmentsController.deleteDepartment = async (req, res) => {
    if (!req.params._id) {Fu
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Departments.findOneAndDelete({
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

departmentsController.updateDepartments = async (req, res) => {
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
        const result = await Departments.updateOne({
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
        const result = await Departments.updateOne({
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

module.exports = departmentsController;