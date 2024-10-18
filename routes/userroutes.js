const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generatetoken} = require('./../jwt');


router.post('/signup',async (req, res)=>{
    try {
        const data = req.body;
        
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generatetoken(payload);
        console.log("Token is : ",token);

        res.status(200).json({response: response, token: token});


    
   } 
   catch (err) {
       console.log(err);
       res.status(500).json({error:'Internet Server Error'});
    }
})

router.post('/login', async(req, res)=>{
    try {
        const {addharcard,password} = req.body;
        const user = await User.findOne({addharcard: addharcard});

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid addharcard or password'});
        }

        const payload = {
            id : user.id
        }

        const token = generatetoken(payload);

        res.json({token})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Invaild Server Error'});
    }
});

router.get('/profile',jwtAuthMiddleware, async(req, res)=>{
    try {
        const userdata = req.user;

        const userID = userdata.id;
        const user = await User.findById(userID);

        res.status(200).json({user});
    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internet Server Error'});

    }
})






router.put('/profile/password',jwtAuthMiddleware,async (req, res)=>{
    try {
        const Userid= req.user;
        const {currentPassword, newpassword} = req.body

        const user = await User.findById(Userid);
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid addharcard or password'});
        }

        user.password = newpassword;
        await user.save();


        console.log('password update');
        res.status(200).json({message: "Password Updated"});
    } catch (err) {
        console.log(err); 
        res.status(500).json({error:'Internet Server Error'});
        
    }
})



module.exports= router;


