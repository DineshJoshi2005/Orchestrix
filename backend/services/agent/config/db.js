import mongoose from "mongoose";

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected succesfully.")
    } catch (error) {
        console.log(`Db Error: ${error}`)
    }
}

export default connectDB;