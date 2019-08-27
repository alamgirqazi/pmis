const inventoryController = {};
const Inventory = require("../models/inventory.model");
const fs = require('fs')
var csv = require("csvtojson");
     
inventoryController.getAll = async (req, res) => {
    let inventory;
    try {
        const {
            start,
            length,
            search,
            location_filter,
            category_filter
        } = req.query
        const {
            value
        } = JSON.parse(search)


        let obj = {}
        let category_obj = {}
        if (value != '') {

            obj = {
                $text: {
                    $search: value
                },
            }
        }
        if (location_filter != '') {

            obj = {
                ...obj,
                Location: location_filter
            }
        }
        if (category_filter != '') {
            category_obj = {

                Category: category_filter
            }
       
        }

        let merged = {...obj,...category_obj}
                inventory = await Inventory.paginate(merged, {
            offset: parseInt(start),
            limit: parseInt(length)
        });

        res.status(200).send({
            code: 200,
            message: 'Successful',
            data: inventory
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};

inventoryController.getEverything = async (req, res) => {
    let inventory;
    try {
        inventory = await Inventory.find({});
        res.status(200).send({
            code: 200,
            message: 'Successful',
            data: inventory
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};

inventoryController.imporInventoryFile = async (req, res) => {
  
    try {
const filePath = `./uploads/${req.file.originalname}`;
const jsonArray=await csv().fromFile(filePath);

const response = await Inventory.insertMany(jsonArray);

// delete file
fs.unlink(filePath, function (err) {
    if (err) return console.log(err);
    console.log('file deleted successfully');
    res.send({
        message: `import complete.`
    });
           });



    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
    
};
inventoryController.inventoryStatistics = async (req, res) => {
    
    try {
   
        const Location = await  Inventory.aggregate(
            [ {$group : { _id : '$Location', count : {$sum : 1}}} ]
        )
        const Category = await  Inventory.aggregate(
            [ {$group : { _id : '$Category', count : {$sum : 1}}} ]
        )
        const Date_added = await  Inventory.aggregate(
            [ {$group : { _id : '$Date_added', count : {$sum : 1}}} ]
        )

responseObj = {

    Location,Category,Date_added
}

        res.status(200).send({
            code: 200,
            message: "Stat",
            data: responseObj
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};

inventoryController.getNextId = async (req, res) => {
    try {
  
      const max_result = await Inventory.aggregate([
        { $group: { _id: null, max: { $max:  '$Id'  } } }
      ]);
  
      let nextId;
      if (max_result.length > 0) {
        nextId = max_result[0].max + 1;
      } else {
        nextId = 1;
      }
    
      var data = {
        code: 200,
        data: { Id: nextId}
      };
      res.status(200).send(data);
    } catch (error) {
      console.log('error', error);
      return res.status(500).send(error);
    }
  };
inventoryController.addInventory = async (req, res) => {
    const max_result = await Inventory.aggregate([
        { $group: { _id: null, max: { $max: '$Id' }  } }
      ]);
      let body = req.body;
      if (max_result.length > 0) {
        body['Id'] = max_result[0].max + 1;
      } else {
        body['Id'] = 1;
      }
    Inventory.create(req.body, function (err, result) {
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
inventoryController.updateInventory = async (req, res) => {
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
        const result = await Inventory.updateOne({
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

inventoryController.deleteInventory = async (req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Inventory.findOneAndDelete({
            _id: _id
        });

        //    const result = await Inventory.updateOne({
        //     _id: _id
        // }, {
        //     $set: {is_deleted: 1}
        // }, {
        //     upsert: true,
        //     runValidators: true
        // });

        res.status(200).send({
            code: 200,
            message: "Deleted Successfully"
        });

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};


module.exports = inventoryController;