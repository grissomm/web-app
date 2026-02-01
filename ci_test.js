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

function postFormData(testUrl, formData, retries = 10, delay = 1000) {
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      try {
        const parsedUrl = new URL(testUrl);
        const protocol = parsedUrl.protocol === "https:" ? https : http;
        
        // URL encode form data
        const postData = Object.keys(formData)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]))
          .join('&');
        
        const options = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port,
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        const req = protocol.request(options, (res) => {
          // Expect redirect (302/301) or success (200)
          if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 200) {
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
        req.write(postData);
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
        reject(new Error("POST request failed"));
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
    await testURL(baseUrl + "/dramas", 10, 1000);
    console.log("✓ Dramas Page OK");
    
    // Test add drama feature
    await postFormData(baseUrl + "/addDrama", {
      title: "Test Drama CI",
      episode: "5",
      genre: "Testing",
      country: "DevOps Land",
      image: "http://example.com/test.jpg"
    });
    console.log("✓ Add Drama OK");
    
    // Verify drama was added
    await testURL(baseUrl + "/dramas", 10, 1000);
    console.log("✓ Drama List with Added Drama OK");
    
    // Test edit drama feature (edit the test drama with distinct name)
    // Drama IDs are auto-incremented, so test drama should have highest ID
    await postFormData(baseUrl + "/editDrama/5", {
      title: "Test Drama CI - EDITED VERSION",
      episode: "10",
      genre: "Testing - Updated",
      country: "DevOps Land Modified",
      image: "http://example.com/test-edited.jpg"
    });
    console.log("✓ Edit Drama OK");
    
    // Verify drama was edited
    await testURL(baseUrl + "/dramas", 10, 1000);
    console.log("✓ Drama List with Edited Drama OK");
    
    // Test delete drama feature (delete the test drama we just edited)
    await postFormData(baseUrl + "/deleteDrama/5", {});
    console.log("✓ Delete Drama OK");
    
    // Verify drama was deleted
    await testURL(baseUrl + "/dramas", 10, 1000);
    console.log("✓ Drama List After Delete OK");
    
    if (server) {
      server.close();
    }
    process.exit(0);
  } catch (err) {
    console.error("✗ Test FAIL - " + err.message);
    process.exit(1);
  }
})();