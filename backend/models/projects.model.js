const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Projects = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
     name: {
        type: String
    },

    activity: {
        type: String
    },
    task: {
        type: String
    },
    department: {
        type: String
    },
    priority: {
        type: String
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    notes: {
        type: String
    },
    donor: {
        type: String
    },
    price: {
        type: Number   },
    users: {
        type: Array
    },
    attachments: {
        type: Array
    },
    status: {
        type: String,
        default: 'pending'
    },
    severity: {
        type: String,
        default: 'normal'
    },
  
    is_deleted: {
        type: Number,
        default: 0
    }
});

Projects.plugin(mongoosePaginate);
// Project.index({'$**': 'text'});

module.exports = mongoose.model("Projects", Projects);

