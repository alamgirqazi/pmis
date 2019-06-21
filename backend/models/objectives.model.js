const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Objectives = new Schema({
 
     name: {
        type: String
    },

    project_id: {
        type: String
    },
    objective_name: {
        type: String
    },
    users_assigned: {
        type: Array
    },
  
    is_deleted: {
        type: Number,
        default: 0
    }
});

Objectives.plugin(mongoosePaginate);
// Project.index({'$**': 'text'});

module.exports = mongoose.model("Objectives", Objectives);

