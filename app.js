// import dependencies
import express from "express";
import dotenv from "dotenv";

//import routes
import router from "./controllers/routes.js";

dotenv.config();

//create instance of express
const app = express();

// use port number specified in dotenv
const PORT = process.env.PORT || 3000;

// enable use of express
app.use(express.json());

//specify this endpoint when using the router in routes.js
app.use("/api/routes", router);

//health check
app.get("/api/health", (req, res) => {
  res.send("Things appear to be working.");
});

//listen for requests from port and return feedback that it's working
app.listen(PORT, () => {
  console.log(`The server is up and running on port ${PORT}`);
});
