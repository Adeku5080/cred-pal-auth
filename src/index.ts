import express, { Express, Request, Response, Application } from "express";
import * as dotenv from "dotenv";
import cookieparser from "cookie-parser";

import authRouter from "./routes/auth";
import connect from "./database/connect";


//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieparser(process.env.JWT_SECRET));


//connect to db
connect(process.env.MONGO_URI);


//routes
app.use("/api/auth",authRouter)

app.listen(port, () => {
  console.log(`Server starting at port ${port}`);
});
