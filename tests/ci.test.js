const request = require("supertest");
const server = require("../app");

afterAll(done => {
  server.close(done);
});

test("Server should start successfully", () => {
  expect(server).toBeDefined();
});

test("GET / should return welcome page", async () => {
  const response = await request(server).get("/");
  expect(response.statusCode).toBe(200);
});

test("GET /dramas should return drama list", async () => {
  const response = await request(server).get("/dramas");
  expect(response.statusCode).toBe(200);
});