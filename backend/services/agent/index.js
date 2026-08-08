import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

dotenv.config()


const port = process.env.PORT
const app = express();


app.use(express.json());

app.use("/", router);

app.use((err, req,res, next) =>{
    console.log(err)
    if (err.status) {
        return res.status(err.status).json(err.data)
    }
    console.error("Message:", err.message);
    console.error("Response:", err.response?.data);
    console.error("Stack:", err.stack);

    return res.status(500).json({
        message: err.response?.data || err.message
    });
})

app.get("/", (req, res) => {
    res.json({ message: "Hello from agent." })
})

app.listen(port, () => {
    console.log(`Server is listening at port: ${port}`);
    connectDB()
})