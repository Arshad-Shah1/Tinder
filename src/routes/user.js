const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { populate } = require("../models/user");
const { set } = require("mongoose");
const userRouter = express.Router();
const User = require("../models/user")

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"
//Get all the pending connection request for the loggedin user
userRouter.get("/user/requests/received", userAuth, async (req,res) => {
    try{
        const loggedInUsser = req.user

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUsser._id,
            status: "interested",
        }).populate("fromUserId",USER_SAFE_DATA)
        //.populate("fromUserId", ["firstName", "lastName"])

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest,
        })
    }catch(error){
        res.status(400).send("Error: "+error.message)
    }
})

userRouter.get("/user/connections", userAuth , async (req,res) => {
    try{
        const loggedInUsser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUsser._id, status: "accepted"},
                {fromUserId: loggedInUsser._id, status: "accepted"},
            ],
        }).populate("fromUserId",USER_SAFE_DATA)
          .populate("toUserId",USER_SAFE_DATA)

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUsser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({data})
    }catch(error){
        res.status(400).json({message: error.message})
    }
})  

//user should see all the user card except 
//1. his own card
//2. his connections 
//3. peoples he ignored
//4. already sent the connection request
userRouter.get("/feed", userAuth, async (req,res) => {
    try{
        const loggedInUsser = req.user

        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.querylimit) || 10
        limit = limit>50 ? 50:limit
        const skip = (page-1) * limit

        //find all connection I recived and I sent
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                //fromUserId is the person sending connection request to loggedIn user
                {fromUserId: loggedInUsser._id},
                //toUserId is the person loggedIn user sending connection request
                {toUserId: loggedInUsser._id},
            ],
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        //looping to connectionRequests to to add each user of connectionRequests 
        //in hideUsersFromFeed and converting in to string because mongodb cannot 
        //compare objectid
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            //$and --> Both conditions must be true.
            //$nin --> “NOT IN” — exclude these values.
            //$ne --> Iska matlab — ye ID match nahi honi chahiye
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUsser._id}}
            ],
        }).select(USER_SAFE_DATA)
          .skip(skip)
          .limit(limit)

        res.send(users)

    }catch(error){
        res.status(400).json({message: error.message}
        )
        console.log(error)
    }
})
module.exports = userRouter 
