const http = require("http");
const server = require("./app"); // your express server

const PORT = process.env.PORT || 3000;

http.get({ hostname: "localhost", port: PORT, path: "/" }, (res) => {
  if (res.statusCode === 200) {
    console.log("✓ Home Page OK");
    server.close();
    process.exit(0); // pass
  } else {
    console.error("✗ Home Page FAIL");
    server.close();
    process.exit(1); // fail
  }
}).on("error", () => {
  console.error("✗ Home Page ERROR");
  server.close();
  process.exit(1);
});