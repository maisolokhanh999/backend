import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Configs/db.js";
import routes from "./routes/index.js";
import dns from "dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// Load env before anything else
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("Server running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
});