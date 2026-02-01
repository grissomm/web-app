const http = require("http");
const https = require("https");
const url = require("url");

function testURL(testUrl, retries = 10, delay = 1000) { 
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      try {
        const parsedUrl = new URL(testUrl);
        const protocol = parsedUrl.protocol === "https:" ? https : http;
        const req = protocol.get(parsedUrl, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            console.log("Got status " + res.statusCode + ", retrying...");
            retry();
          }
        });
        req.on("error", (err) => {
          console.log("Request error: " + err.message + ", retrying...");
          retry();
        });
        req.end();
      } catch (err) {
        console.log("Exception: " + err.message + ", retrying...");
        retry();
      }
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
    let baseUrl;
    let server;
    
    // If TEST_URL is set, test against remote Render service
    if (process.env.TEST_URL) {
      baseUrl = process.env.TEST_URL;
      console.log("Testing remote Render service at " + baseUrl);
    } else {
      // Otherwise, start local server and test it
      server = require("./app");
      const port = process.env.PORT || 3000;
      baseUrl = "http://localhost:" + port;
      console.log("Testing local server at " + baseUrl);
      // Wait for server to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Test home page
    await testURL(baseUrl + "/", 10, 1000);
    console.log("✓ Home Page OK");
    
    // Test dramas page
    await testURL(baseUrl + "/testagain", 10, 1000);
    console.log("✓ Dramas Page OK");
    
    if (server) {
      server.close();
    }
    process.exit(0);
  } catch (err) {
    console.error("✗ Test FAIL - " + err.message);
    process.exit(1);
  }
})();