const mongoose = require('mongoose');

const mongourl= 'mongodb://localhost:27017/votepanel'

mongoose.connect(mongourl,{
    useNewURLParser: true,
    useUnifiedTopology: true,

})

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('Connected to MongoDB');
});
db.on('disconnected',()=>{
    console.log('Disconnected From MongoDB'); 
});
db.on('error',()=>{
    console.log('Error Occured');
});

module.exports= db;
