const express = require('express');
const router = express.Router();
const candidates = require('../models/candidates');
const User = require('../models/user');
const {jwtAuthMiddleware, generatetoken} = require('../jwt');

const checkAdminrole = async (userID)=>{
    try {
        const user= await candidates.findById(userID);
        if(user.role === 'admin'){
            return true;
        } 
    } catch (err) {
        return false; 
    }
}


router.post('/',async (req, res)=>{
    try {
        if( await ! checkAdminrole(req.user.id)){
            return res.status(403).json({message: 'user is not an admin'});
        }
        const data = req.body;
        
        const newcandidates = new candidates(data);
        const response = await newcandidates.save();
        console.log('data saved');

       

        res.status(200).json({response: response});


    
   } 
   catch (err) {
       console.log(err);
       res.status(500).json({error:'Internet Server Error'});
    }
})










router.put('/:candidateID',jwtAuthMiddleware,async (req, res)=>{
    try {
        if(!checkAdminrole(req.user.id)){
            return res.status(403).json({message: 'user is not an admin'});
        }
        const candidateid= req.params.candidateID;
        const updatecandidatedata = req.body;

        const response = await candidates.findByIdAndUpdate(candidateid,updatecandidatedata,{
            new: true,
            runvalidators: true,

        })

        if(!response){
            return res.status(404).json({ error: "Candidate not found"});
        }

        console.log('Candidate data updated');
        res.status(200).json(response);
        } catch (err) {
        console.log(err); 
        res.status(500).json({error:'Internet Server Error'});
        
    }
})



router.delete('/:candidateID',jwtAuthMiddleware,async (req, res)=>{
    try {
        if(!checkAdminrole(req.user.id)){
            return res.status(403).json({message: 'user is not an admin'});
        }
        const candidateid= req.params.candidateID;

        const response = await candidates.findByIdAndDelete(candidateid);
        if(!response){
            return res.status(404).json({ error: "Candidate not found"});
        }

        console.log('Candidate deleted');
        res.status(200).json(response);
        } catch (err) {
        console.log(err); 
        res.status(500).json({error:'Internet Server Error'});
        
    }
})

router.post('/vote/:candidateID',jwtAuthMiddleware, async (req, res)=>{
    candidateID= req.params.candidateID;
    userID = req.user.id;

    try {
        const candidate= await candidates.findById(candidateID);
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found'});

        }

        const user = await User.findById(userID);
        if(!user){
            return res.status(404).json({message: 'User not found'});

        }
        if(user.isVoted){
            res.status(400).json({message: 'You have already voted'});
        }

        if(user.role == 'admin'){
            res.status(403).json({message: 'admin is not a allowed'});
        }

        candidate.votes.push({user: userID})
        candidate.votecount++;
        await candidate.save();

        user.isVoted = true
        await user.save();

        res.status(200).json({message: 'Vote recorded successfully'});
    } catch (err) {
        console.log(err);
       res.status(500).json({error:'Internet Server Error'});
    }
})

router.get('/vote/count',async(req, res)=>{
    try {
        const candidate = await candidates.find().sort({votecount: 'desc'});
        const record = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.votecount
            }
        });

        return res.status(200).json(record)
    } catch (err) {
        console.log(err);
       res.status(500).json({error:'Internet Server Error'});
        
    }
})

module.exports= router;


