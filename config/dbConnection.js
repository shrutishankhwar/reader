const mongoose = require('mongoose');
const MONGODB_URL= process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("mongoDB connected");

    } catch (error) {
        console.log(error);
        process.exit(1);

    }
}

module.exports = connectDB;