const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:'string',
        required:true,
        min:5,
        max:255
    },
    email:{
        type:'string',
        required:true
    },
    password:{
        type:'string',
        required:true
    }
})

module.exports = mongoose.model("User", userSchema); // collection name is users (user)