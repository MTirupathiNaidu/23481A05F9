const fetch = require("node-fetch");

const LOG_API = "http://20.244.56.144/evaluation-service/logs";

async function log(stack, level, pkg, message, token) {
  try {
    await fetch(LOG_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
  } catch (err) {
    // DO NOT use console.log
  }
}

module.exports = log;