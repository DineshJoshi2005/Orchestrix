import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authenticate from "./middlewares/auth.middleware.js";
import { getCurrentUser } from "./controller/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";

dotenv.config()
const port = process.env.PORT
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())
app.use(morgan("dev"));
app.use("/auth", proxy(process.env.AUTH_SERVICE));
app.use("/chat", authenticate, proxyWithHeader(process.env.CHAT_SERVICE));
app.use("/agent", authenticate, proxyWithHeader(process.env.AGENT_SERVICE));
app.use("/billing", authenticate, proxyWithHeader(process.env.BILLING_SERVICE));
app.get('/me', authenticate, getCurrentUser);

app.get("/", (req, res) => {
    res.json({message: "Hello from Gateway v1"})
})

app.listen(port, () => {
    console.log(`Server is listening at port: ${port}`)
})