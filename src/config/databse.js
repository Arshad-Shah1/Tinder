const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://Valk:zCiGriYaHaFg25F8@cluster0.apigrxi.mongodb.net/valkTinder"
    );
};

module.exports = connectDB;
