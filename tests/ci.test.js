const http = require("http");
const server = require("../app.js"); // make sure your app exports the server

describe("Web app routes", () => {
  afterAll(() => {
    server.close(); // close server after all tests
  });

  test("Home Page should return 200", (done) => {
    http.get("http://localhost:3000/", (res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  test("Drama Page should return 200", (done) => {
    http.get("http://localhost:3000/dramas", (res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});