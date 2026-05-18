import express from "express";
import router from "./router.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use("/shopNest/api/v1", router);

export default app;