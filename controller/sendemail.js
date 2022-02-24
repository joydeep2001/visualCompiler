const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "engineerswayofficial@gmail.com",
    pass: "03324115599",
  },
});

function sendEmail(mailOption) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOption, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
function getEmailOptions(emailid, accessToken) {
  this.from = "Engineer's Way";
  this.to = emailid;
  this.subject = "Verify Your account";
  this.text = `http://localhost:3001/auth/activate/${accessToken}`;
}

module.exports = {
  getEmailOptions,
  sendEmail,
};
