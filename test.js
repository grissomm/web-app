const http = require("http");
const assert = require("assert");

const server = require("./app");

function testHomePage() {
  http.get("http://localhost:3000", (res) => {
    try {
      assert.strictEqual(res.statusCode, 200);
      console.log("✓ Test Passed: Home page returns 200");
      server.close();
    } catch (err) {
      console.error("✗ Test Failed");
      server.close();
      process.exit(1);
    }
  }).on("error", (err) => {
    console.error("✗ Server error", err);
    server.close();
    process.exit(1);
  });
}

testHomePage();