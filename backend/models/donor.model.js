const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Donor = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
     name: {
        type: String
    },
     company: {
        type: String
    },

      focal_person: {
        type: String
    },

      phone: {
        type: String
    },
   
     designation: {
        type: String
    },
   
  
    is_deleted: {
        type: Number,
        default: 0
    }
});

Donor.plugin(mongoosePaginate);

module.exports = mongoose.model("Donor", Donor);

