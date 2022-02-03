const {
  writeFile,
  getFileExtension,
  compile,
} = require("./controller/compileUtils");
const { exec } = require("child_process");
const fs = require("fs");
const fspromises = require("fs").promises;
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

app.post("/api/compile", async (req, res) => {
  let fileName = `test.${getFileExtension(req.body.language)}`;
  await writeFile(fileName, req.body.code);
  let result = await compile(fileName, req.body.language);
  res.json(result);
});
app.listen(3001);
