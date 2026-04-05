const express = require("express")
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditprofileData } = require("../utils/validation");

//Finding single user
profileRouter.post("/profile/view",userAuth, async (req,res) => {
    try{
        const user = await req.user;
        res.send(user);
    }catch(error) {
        res.status(400).send("Err saving the user : "+ error.message)
        console.log(error);
    }
})

profileRouter.patch("/profile/edit", userAuth , (req,res) => {
    try{
        if(!validateEditprofileData(req)){
            throw new Error("Invalid Edit Request")
        }

        const loggedInUser = req.user
        console.log(loggedInUser)

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
        console.log("Updated user")
        console.log(loggedInUser)

        res.send(loggedInUser.firstName + " your profile updated successfully")
    }catch(error){
        res.status(400).send("Error" + error.message)
    }
})

module.exports = profileRouter
