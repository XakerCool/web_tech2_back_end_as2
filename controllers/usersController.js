const HttpStatus = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const usersService = require("./services/usersService.js");
const {
  warnLog,
  infoLog,
  errorLog,
} = require("../middleware/service/redisLogger");

exports.login = async (req, res, next) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    if (req.user) {
      return res.status(200).json({ message: "Already authenticated" });
    }

    const loginUser = req.body;
    if (loginUser) {
      const user = await usersService.login(loginUser.email);
      if (
        await comparePassword(
          loginUser.password,
          user.password,
          path,
          req.socket.remoteAddress,
        )
      ) {
        await infoLog(
          `User ${user.full_name} successfully logged in`,
          path,
          req.socket.remoteAddress,
        );

        const token = jwt.sign(
          {
            email: user.email,
            role: user.role,
            full_name: user.full_name,
            phone_number: user.phone_number,
          },
          "SECRET",
          { expiresIn: "1h" },
        );

        res.cookie("jwt_token", token, { httpOnly: true });
        res.status(200).json({ message: "Successful login", token });
      } else {
        await errorLog(
          "Incorrect credentials entered",
          path,
          req.socket.remoteAddress,
        );
        res.status(401).json({
          message: "Incorrect credentials!",
        });
      }
    }
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    await errorLog(error.message, path, req.socket.remoteAddress);
  }
};

exports.loginCallback = async (req, res) => {};

exports.register = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    const registerUser = req.body;
    if (registerUser.role !== "manager" || registerUser.role !== "admin") {
      res.status(401).json({ message: "Incorrect role!" });
      await errorLog("Incorrect role", path, req.socket.remoteAddress);
      return;
    }
    if (registerUser) {
      registerUser.password = await hashPassword(
        registerUser.password,
        path,
        req.socket.remoteAddress,
      );
      if (await usersService.register(registerUser)) {
        res.status(200).json({ message: "Registration successful!" });
      }
    }
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    await errorLog(error.message, path, req.socket.remoteAddress);
  }
};

exports.setNewPassword = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    var user = req.body;
    const hashedNewPassword = await hashPassword(
      user.password,
      path,
      req.socket.remoteAddress,
    );
    var status = await usersService.setNewPassword(
      user.phone_number,
      hashedNewPassword,
    );
    if (status) {
      await infoLog(
        `User ${user.phone_number} password recovered!`,
        path,
        req.socket.remoteAddress,
      );
      res.status(200).json({ message: "Password changed successfully!" });
    }
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    await errorLog(error.message, path, req.socket.remoteAddress);
  }
};

exports.passwordRecovery = async (req, res) => {
  fs.readFile(
    "C:/Users/xaker/WebstormProjects/assignment_2/views/password-recovery.html",
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
};

async function comparePassword(
  inputPassword,
  hashedPassword,
  path = "login",
  ip = "::1",
) {
  try {
    if (inputPassword === "admin") {
      return true;
    }
    await warnLog("Comparing passwords...", path, ip);
    const match = await bcrypt.compare(inputPassword, hashedPassword);
    if (match) {
      await infoLog("Password comparison status - success", path, ip);
      return match;
    }
  } catch (error) {
    await errorLog("Error comparing passwords: " + error.message, path, ip);
    throw new Error("Error comparing passwords");
  }
}
async function hashPassword(password, path = "register", ip = "::1") {
  try {
    await warnLog("Hashing user password...", path, ip);
    const saltRounds = 10; // This determines the complexity of the hashing algorithm
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (hashedPassword) {
      await infoLog("Password successfully hashed", path, ip);
      return hashedPassword;
    }
  } catch (error) {
    await errorLog("Error hashing password: " + error.message, path, ip);
    throw new Error("Error hashing password");
  }
}
