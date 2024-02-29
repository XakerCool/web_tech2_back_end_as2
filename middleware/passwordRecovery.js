const crypto = require("crypto");
const HttpStatus = require("http-status");
const { errorLog } = require("./service/redisLogger");
const client = require("twilio")(
  "AC8a5b0b60727eb6e9650faecf04b3b058",
  "51382d76726f26b2b47003a1f5166078",
);
const userService = require("../controllers/services/usersService.js");

exports.sendOTP = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    var user = req.body;
    var userFromDb = await userService.getUserByPhoneNumber(user.phone_number);
    if (!userFromDb) {
      res
        .status(401)
        .json({ message: "There is no user with this phone number!" });
    } else {
      const OTP = generateRandomPassword(10);

      client.messages
        .create({
          body: OTP,
          from: "whatsapp:+14155238886",
          to: `whatsapp:${user.phone_number}`,
        })
        .then(() => {
          res
            .status(200)
            .json({ message: "Recovery code sent", recovery_code: OTP });
        });
    }
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    await errorLog(error.message, path, req.socket.remoteAddress);
  }
};

function generateRandomPassword(length) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}
