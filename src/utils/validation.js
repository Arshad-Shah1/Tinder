const validator = require("validator")

const validateSignupData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName)
    {
        throw new Error("Name is not vlaid")
    }
    else if(!validator.isEmail(emailId))
    {
        throw new Error("Email ID is not valid")
    }
    // else if(!validator.isStrongPassword(password))
    // {
    //     throw new Error("Enter strong password")
    // }
}

const validateEditprofileData = (req,) => {
    const allowedEditField = [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills",
    ]

    const isEditAllowed = Object.keys(req.body).every((field) => 
        allowedEditField.includes(field))
    return isEditAllowed    
}

module.exports = {
    validateSignupData,
    validateEditprofileData, 
}
