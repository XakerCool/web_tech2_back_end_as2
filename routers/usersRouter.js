const express = require("express");
const router = express.Router();
const usersMiddleware = require("../middleware/passwordRecovery.js");
const usersController = require("../controllers/usersController.js");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const APP_ID = "1538908906674478";
const APP_SECRET = "4db2514d8639bf1dbdf984145a8ed7c3";
const REDIRECT_URI = "<http://localhost:3000/auth/facebook/callback>";

router.post("/login", usersController.login);
router.post("/register", usersController.register);
router.get("/password-recovery", usersController.passwordRecovery);
router.post("/send-OTP", usersMiddleware.sendOTP);
router.post("/set-new-password", usersController.setNewPassword);

router.get("/facebook", async (req, res) => {
  fs.readFile(
    "C:/Users/xaker/WebstormProjects/assignment_2/views/login.html",
    null,
    function (err, html) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Server internal error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      }
    },
  );
});

/*
На странице логина в фейсбуке
* Невозможно загрузить URL
Домен этого URL не включен в список доменов приложения.
* Чтобы загрузить этот URL, добавьте все домены и поддомены своего приложения в поле
* «Домены приложения» в настройках вашего приложения.
* */

router.get("/facebook/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v13.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`,
    );
    const { access_token } = data;
    const { data: profile } = await axios.get(
      `https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`,
    );

    const token = jwt.sign(
      {
        userId: profile.id,
        email: profile.email,
        name: profile.name,
      },
      "SECRET",
      { expiresIn: "1h" },
    );
    res.cookie("jwt_token", token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    console.error("Error:", error.response.data.error);
    res.redirect("/login");
  }
});

module.exports = router;
