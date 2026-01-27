const http = require("http");
const server = require("./app");

function waitForServer(port, retries = 5, delay = 500) {
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      http.get({ hostname: "localhost", port, path: "/" }, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry();
        }
      }).on("error", retry);
    };

    const retry = () => {
      if (retries-- > 0) {
        setTimeout(tryConnect, delay);
      } else {
        reject(new Error("Server not responding"));
      }
    };

    tryConnect();
  });
}

(async () => {
  try {
    console.log("Waiting for server...");
    await waitForServer(3000);
    console.log("✓ Home Page OK");
    server.close();
    process.exit(0);
  } catch (err) {
    console.error("✗ Home Page FAIL");
    server.close();
    process.exit(1);
  }
})();