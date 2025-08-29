const mongoose = require('mongoose');
require('dotenv').config();

const connectdb = async() =>{
    try{
        mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/practiceDb');
        console.log('MongoDb connected....')
    }
    catch(err){
        console.log("Error: " + err)
    }
}
module.exports = connectdb