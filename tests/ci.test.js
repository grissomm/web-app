const request = require("supertest");
const server = require("../app");

afterAll(done => {
  server.close(done);
});

test("Server should start without crashing", () => {
  expect(server).toBeDefined();
});

test("GET / should return status 200", async () => {
  const response = await request(server).get("/");
  expect(response.statusCode).toBe(200);
});