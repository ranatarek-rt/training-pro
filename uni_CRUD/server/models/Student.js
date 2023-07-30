const moongose = require('mongoose');

const Schema = moongose.Schema;

const StudentSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    tel:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    },
    updatedAt:{
        type:Date,
        default: Date.now(),

    }
     

});

module.exports = moongose.model('Student',StudentSchema);
//module.exports = moongose.model('Customer',StudentSchema); 3ala 7sab any database hy3mel save feha



