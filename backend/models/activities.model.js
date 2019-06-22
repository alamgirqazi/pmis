const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Activities = new Schema({
 
     name: {
        type: String
    },

    project_id: {
        type: String
    },
    objective_id: {
        type: String
    },
    activity_name: {
        type: String
    },
    status: {
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

Activities.plugin(mongoosePaginate);
// Project.index({'$**': 'text'});

module.exports = mongoose.model("Activities", Activities);

