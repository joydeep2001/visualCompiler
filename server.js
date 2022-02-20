require("dotenv").config();
const {
  writeFile,
  getFileExtension,
  compile,
} = require("./controller/compileUtils");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {

  console.log("response recieved");
  res.json("Port working");
  

})
app.post("/api/compile", async (req, res) => {
  let fileName = `test.${getFileExtension(req.body.language)}`;
  await writeFile(fileName, req.body.code);
  let result = await compile(fileName, req.body.language);
  res.json(result);
});
let userProfileInfo = {};
passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: process.env.CALLBACKURL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile.displayName);
      userProfileInfo = profile;
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.get("/secret", (req, res) => {
  res.send(`<h1>Welcome ${userProfileInfo.displayName}!</h1>`);
});
app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/secret");
  }
);
app.listen(process.env.PORT);
