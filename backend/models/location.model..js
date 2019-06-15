const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Location = new Schema({
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

Location.plugin(mongoosePaginate);

module.exports = mongoose.model("Location", Location);

