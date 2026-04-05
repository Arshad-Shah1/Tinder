const User = require("../models/user")
const jwt = require("jsonwebtoken")

const userAuth = async (req , res , next) => {
    try{
        const { token } = req.cookies
        if(!token)
        {
            throw new Error("Token is not valid")
        }
        const decodedMessage = await jwt.verify(token,"valkTinder")
        const { _id } = decodedMessage
        const user = await User.findById(_id)
        if(!user)
        {
            throw new Error("User not found")
        }

        req.user = user
        console.log("Incoming cookies:", req.cookies);
        next();        
    }catch(error) {
        res.status(400).send("Error : "+ error.message)
        console.log(error);
    }
}

module.exports = {
    userAuth,
}
