const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Tasks = new Schema({
 
     name: {
        type: String
    },

    project_id: {
        type: String
    },
    objective_id: {
        type: String
    },
    activity_id: {
        type: String
    },
    task_name: {
        type: String
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    severity: {
        type: String,
        default: 'normal'
    },
    status: {
        type: String,
        default: 'pending'
    },
    users_assigned: {
        type: Array
    },
    attachments: {
        type: Array
    },
  
    is_deleted: {
        type: Number,
        default: 0
    }
});

Tasks.plugin(mongoosePaginate);
// Project.index({'$**': 'text'});

module.exports = mongoose.model("Tasks", Tasks);

