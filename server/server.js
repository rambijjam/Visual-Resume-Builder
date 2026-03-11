require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/github", require("./routes/github"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/ai", require('./routes/ai'));
app.use("/api/ats", require('./routes/ats'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
    connectDB(()=>{
        console.log("Connected to MongoDB");
    });
})