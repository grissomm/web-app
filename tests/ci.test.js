const http = require("http");
const assert = require("assert");

// Import your app (server must be exported)
const server = require("app.js");

function testRoute(path, name, done) {
  http.get(
    { hostname: "localhost", port: 3000, path },
    (res) => {
      try {
        assert.strictEqual(res.statusCode, 200);
        console.log(`✓ PASS: ${name}`);
        done();
      } catch (err) {
        console.error(`✗ FAIL: ${name}`);
        server.close();
        process.exit(1);
      }
    }
  ).on("error", () => {
    console.error(`✗ ERROR: ${name}`);
    server.close();
    process.exit(1);
  });
}

console.log("Running automated CI tests...");

// Run test cases in order
testRoute("/", "Home Page", () => {
  testRoute("/dramas", "Drama Page", () => {
    console.log("✓ ALL TESTS PASSED");
    server.close();
    process.exit(0);
  });
});