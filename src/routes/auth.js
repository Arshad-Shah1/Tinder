const express = require("express")
const authRouter = express.Router();
const User = require("../models/user");
const {validateSignupData} = require("../utils/validation")
const bcrypt = require("bcrypt")

authRouter.post("/login", async (req,res) => {
    try{
        const {emailId, password} = req.body

        const user = await User.findOne({emailId:emailId})
        if(!user)
        {
            throw new Error("Invalid Email ID or Password")
        }
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid)
        {
            //create a jwt token
            const token = await user.getJWT();
            console.log(token)
            //add token into cookeie and send the res back to the user
            res.cookie("token",token,{
                expires: new Date(Date.now() + 500 * 3600000)
            })
            res.send("Login Successfully")
        }
        else
        {
            throw new Error("Invalid Email ID or Password")
        }
    }
    catch(error)
    {
        res.status(400).send("Error : "+ error.message)
        console.log(error);
    }
})

//Adding new user
authRouter.post("/signup", async (req,res) => {
    try{
        //validation of data
        validateSignupData(req);

        //encrypt the password
        const {firstName, lastName, emailId, password} = req.body
        const passowrdHash = await bcrypt.hash(password, 10)
        console.log(passowrdHash)

        //Creating a new instance of user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passowrdHash,
        });

        await user.save();
        console.log(user)
        res.send("User added successfully");
    } catch(error) {
        res.status(400).send("Err saving the user : "+ error.message)
        console.log(error);
    }
})

authRouter.post("/logout",(req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    })
    res.send("Logout Successful")
})

module.exports = authRouter
