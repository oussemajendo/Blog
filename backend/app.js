const express = require("express");
const connectToDb = require("./config/connectToDb");
const { errorHandler, notFound } = require("./middlewares/error");
const cors = require("cors");
require("dotenv").config();



//connection to DB
connectToDb();

//Init App
const app = express();

//Middlewares
app.use(express.json());

// Cors Policy
app.use(cors({
    origin: "*",
}));

//Routes
app.use("/api/auth/", require("./routes/authRoute"));
app.use("/api/users/", require("./routes/usersRoute"));
app.use("/api/posts/", require("./routes/postsRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoriesRoute"));
app.use("/api/password", require("./routes/passwordRoute"));

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);


//
app.use((req,res)=>{
    res.send("API is running...")
});



//Running app
const PORT = process.env.PORT || 8000 ;
app.listen(PORT,()=> console.log(`
Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
)
);