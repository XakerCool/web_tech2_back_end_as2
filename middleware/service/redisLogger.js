const { createClient } = require("redis");

const client = createClient({
  url: "redis://default:iWaQKYzclzW6hoWLKIyvqbOR8F3ibEzz@redis-18473.c1.asia-northeast1-1.gce.cloud.redislabs.com:18473",
});

exports.connect = async () => {
  client
    .connect()
    .then(() => {
      console.log("Redis connected successfully");
    })
    .catch((error) => {
      console.log(error);
    });
  client.on("error", (err) => console.log("Redis Client Error", err));
};

exports.clearLogs = async () => {
  try {
    await client.flushAll();
  } catch (error) {
    console.log(error.message + " ");
  }
};

exports.getLogs = async () => {
  try {
    var logs = await client.lRange("logs", 0, -1);
    return logs.map((log) => JSON.parse(log));
  } catch (error) {
    console.log(error);
  }
};

exports.infoLog = async (message, usedRoute, userIP) => {
  var logObj = formatLog("INFO", usedRoute, userIP);
  logObj.message = message;
  await setLog(logObj);
};

exports.errorLog = async (message, usedRoute, userIP) => {
  var logObj = formatLog("ERROR", usedRoute, userIP);
  logObj.message = message;
  await setLog(logObj);
};

exports.warnLog = async (message, usedRoute, userIP) => {
  var logObj = formatLog("WARN", usedRoute, userIP);
  logObj.message = message;
  await setLog(logObj);
};

formatLog = (logType, usedRoute, userIP) => {
  var result = {};
  var logDate = new Date();
  result.logType = logType;
  result.logDate = `${logDate.getDate()}.${logDate.getMonth() + 1}.${logDate.getFullYear()} ${logDate.getHours()}:${logDate.getMinutes()}:${logDate.getSeconds()}`;
  result.logUsedRoute = `Msg from: ${usedRoute}`;
  result.logUserIP = `User inf: ${userIP}`;

  return result;
};

setLog = async (logData) => {
  var logValue = JSON.stringify(logData);
  await client.rPush("logs", logValue, (err, reply) => {
    if (err) {
      console.log(`Something went wrong while logging: ${err}`);
    } else {
      console.log(`Reply ${reply}`);
    }
  });
};
