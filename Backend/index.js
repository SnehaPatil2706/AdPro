let express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect("mongodb://localhost:27017/adpro").then((res)=>{
    console.log("Database Connected...");
});

let app = express();
app.use(cors()); // Add this line to enable CORS
app.use(express.json());

app.get("/",(req, res)=>{
    res.send("Welcome to AdPro API");
});

app.use("/authentication",require("./routes/authenticationRoute"));
app.use("/agencies",require("./routes/agenciesRoute"));
app.use("/adschedules",require("./routes/adSchedulesRoute"));
app.use("/clients",require("./routes/clientsRoute"));
app.use("/emedias",require("./routes/emediasRoute"));
app.use("/financialyears",require("./routes/financialYearsRoute"));
app.use("/gsts",require("./routes/gstsRoute"));
app.use("/holidays",require("./routes/holidaysRoute"));
app.use("/login",require("./routes/loginRoute"));
app.use("/modules",require("./routes/modulesRoute"));
app.use("/menus",require("./routes/menusRoute"));
app.use("/modulemenus",require("./routes/moduleMenusRoute"));
app.use("/pmedia",require("./routes/pmediaRoute"));
app.use("/roles",require("./routes/rolesRoute"));
app.use("/rolemodules",require("./routes/roleModulesRoute"));
app.use("/states",require("./routes/statesRoute"));
app.use("/users",require("./routes/usersRoute"));
app.use("/workschedules",require("./routes/workSchedulesRoute"));

app.listen(8081,()=>{
    console.log("server is running on port http://localhost:8081");
});