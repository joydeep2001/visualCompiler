require("dotenv").config();
const {
  writeFile,
  getFileExtension,
  compile,
} = require("./controller/compileUtils");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const user = require("./routes/user");
const auth = require("./routes/auth");
const config = require("config");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwt private key is not defined");
  process.exit(1);
}

app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  console.log("response recieved");
  res.json("Port working");
});
app.post("/api/compile", async (req, res) => {
  let fileName = `test.${getFileExtension(req.body.language)}`;
  await writeFile(fileName, req.body.code);
  let result = await compile(fileName, req.body.language);
  res.json(result);
});

app.use("/user", user);
app.use("/auth", auth);
app.listen(process.env.PORT);
