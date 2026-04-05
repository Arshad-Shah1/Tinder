const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName :{
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Email is not valid "+value)
            }
        }
    },
    password:{
        type: String,
        required: true,
        // validate(value){
        //     if(!validator.isStrongPassword(value))
        //     {
        //         throw new Error("Enter a strong password "+value)
        //     }
        // }
    }, 
    age:{
        type: Number,
        min: 11,
        max: 100,
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value))
            {
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmgnnjQFZUlP_pvTQBTs7HrzsBpJVOM6FI_w&s",
        validate(value){
            if(!validator.isURL(value))
            {
                throw new Error("Photo URL is not valid "+value)
            }
        }
    },
    about: {
        type: String,
        default: "This is default about"
    },
    skills: {
        type: [String]
    }
},
{
    timestamps: true,
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id : user._id}, "valkTinder",{expiresIn:"30d"});

    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user= this;
    const passowrdHash = user.password
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passowrdHash)

    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema)
