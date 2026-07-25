import express from "express";
import dotenv from "dotenv";
dotenv.config();
import ConnectDB from "./config/db.js";
import router from "./routes/billing.routes.js";




const app = express();
const PORT = process.env.PORT ;
app.use(express.json());
app.use("/",router);
app.get('/', (req, res) => {
  res.status(200).json({ message: "Billing service is running" }) ;
});

app.listen(process.env.PORT , () => {
    ConnectDB();
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});