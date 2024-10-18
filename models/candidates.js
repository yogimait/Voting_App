const mongoose= require('mongoose');


const candySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    party:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    votes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt:{
                type:Date,
                default: Date.now()
            }
        }
    ],
    votecount:{
        type: Number,
        default: 0
    }
});

const Candy= mongoose.model('Candy', candySchema);
module.exports = Candy;