const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Designation = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
     name: {
        type: String
    },
  
    is_deleted: {
        type: Number,
        default: 0
    }
});

Designation.plugin(mongoosePaginate);

module.exports = mongoose.model("Designation", Designation);

