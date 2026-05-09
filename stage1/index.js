const fetch = require("node-fetch");
const log = require("../logging_middleware/logger");

const API = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN = "YOUR_ACCESS_TOKEN";

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function getTopNotifications() {
  try {
    await log("backend", "info", "fetchNotifications", "Fetching notifications", TOKEN);

    const res = await fetch(API, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const data = await res.json();

    await log("backend", "info", "processData", "Processing notifications", TOKEN);

    const sorted = data.notifications.sort((a, b) => {
      const p1 = priorityMap[a.Type] || 0;
      const p2 = priorityMap[b.Type] || 0;

      if (p1 !== p2) return p2 - p1;

      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const top10 = sorted.slice(0, 10);

    await log("backend", "info", "result", "Top 10 computed", TOKEN);

    return top10;

  } catch (err) {
    await log("backend", "error", "getTopNotifications", err.message, TOKEN);
  }
}

// Run
(async () => {
  const result = await getTopNotifications();
  process.stdout.write(JSON.stringify(result, null, 2));
})();