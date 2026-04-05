const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser")

app.use(express.json()); 
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter) 
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

// //Finding single user
// app.post("/user", async(req,res) => {
//     const userEmail = req.body.emailId;

//     try{
//         const users = await User.find({emailId:userEmail});
//         if(users.length === 0)
//         { 
//             res.send("user not found");
//         }
//         else 
//         {
//             res.send(users);
//             console.log("data send successfully")
//         }
//     }
//     catch(err){
//         res.status(400).send("Something Went Wrong");
//         console.log(err);
//     }
// })
// //Sending information of all users
// app.get("/fetch", async (req,res) => {
//     try{
//         const users = await User.find({});
//         res.send(users)
//         console.log("Data send successfully")
//     }
//     catch(err)
//     {
//         res.send("something went wrong Cannot fech data");
//         console.log(err)
//     }
// })

// //Updating Single user by his ID
// app.patch("/user/:_id", async (req,res) => {
//     const userId = req.params?._id;
//     const data = req.body;                       
//     try{
//         const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];
//         const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))

//         if(!isUpdateAllowed)
//         {
//             throw new Error("update not allowed")
//         }

//         if(data?.skills.length>10)
//         {
//             throw new Error("Max 10 skills allowed")
//         }
        
//         const user = await User.findByIdAndUpdate({_id:userId},data , {
//             runValidators: true,
//         });
//         res.send("user updated successfully");
//     }catch(err)
//     {
//         res.send("Something went wrong");
//         console.log(err);
//     }
// })

// //Update user using emailId
// app.patch("/user1", async (req,res) => {
//     const email = req.body.emailId;
//     const data = req.body;
//     try{
//         const user = await User.findOneAndUpdate({emailId:email},data);
//         res.send("user updated successfully");
//     }catch(err)
//     {
//         res.send("Something went wrong");
//         console.log(err);
//     }
// })

// //Deleting user by his id
// app.delete("/user", async(req,res) => {
//     const userId = req.body._id
//     try{
//         const user = await User.findByIdAndDelete({_id:userId});
//         res.send("User deleted successfully");
//     }
//     catch(err){
//         res.send("Something went wrong");
//         console.log(err)
//     }
// })

connectDB()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(7777, () => {
            console.log("Litening at port 7777");
        });
    })
    .catch((error) => {
        console.error("Cannot connect to database", error);
    }) 
