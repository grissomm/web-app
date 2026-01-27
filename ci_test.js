const http = require("http");
const assert = require("assert");

// Import your app (server must be exported)
const server = require("./app");

const PORT = process.env.PORT || 3000; // Use env port for CI
const HOST = "0.0.0.0"; // Make sure server listens correctly

function testRoute(path, name) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: "localhost", port: PORT, path }, (res) => {
      try {
        assert.strictEqual(res.statusCode, 200);
        console.log(`✓ PASS: ${name}`);
        resolve();
      } catch (err) {
        console.error(`✗ FAIL: ${name}`);
        reject(err);
      }
    }).on("error", (err) => {
      console.error(`✗ ERROR: ${name}`);
      reject(err);
    });
  });
}

async function runTests() {
  console.log("Running automated CI tests...");

  try {
    // Give the server a moment to start
    await new Promise(r => setTimeout(r, 500));

    await testRoute("/", "Home Page");
    await testRoute("/dramas", "Drama Page");

    console.log("✓ ALL TESTS PASSED");
    server.close();
    process.exit(0);
  } catch (err) {
    server.close();
    process.exit(1); // Fail CI
  }
}

runTests();