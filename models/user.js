const mongoose= require('mongoose');
const crypto = require('bcrypt');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    mobile:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        type: String
    },
    addharcard:{
        type: Number,
        required: true,
        unique:true
    },
    password:{
        required: true,
        type: String
    },
    role:{
        type: String,
        enum: ['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
});

userSchema.pre('save', async function(next){
    const user = this;

    if(!user.isModified('password')) return next();

    try {
        const salt = await crypto.genSalt(10);

        const hashedpassword = await crypto.hash(user.password, salt);

        user.password = hashedpassword;
        

        next();
    } catch (err) {
        return next(err);
    }

})


userSchema.methods.comparepassword = async function(candidatepassword){
    try {
        

        const ismatch= await crypto.compare(candidatepassword, this.password);
        return ismatch;
    } catch (err) {
        throw err;
    }
}
const User= mongoose.model('User', userSchema);
module.exports = User;