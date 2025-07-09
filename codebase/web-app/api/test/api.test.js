import request from "supertest";
import sinon from "sinon";
import { expect } from "chai";
import app from "../api/router.js";
import * as getTimeModule from "../api/utils/getTime.js";
import * as addToDbModule from "../api/supabase/addToDb.js";
import * as getDataFromDbModule from "../api/supabase/getDataFromDb.js";
import * as getFarmingAdviceModule from "../api/claude/getFarmingAdvice.js";
import * as takeIoTActionModule from "../api/claude/takeIoTAction.js";

describe("Weather Man API", () => {
  afterEach(() => sinon.restore());

  describe("GET /api/check", () => {
    it("should return API status", async () => {
      const res = await request(app).get("/api/check");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.nested.property(
        "message.API Status Response",
        "Weather Man API is Working!",
      );
      expect(res.header).to.have.property("x-robots-tag", "noindex, nofollow");
    });
  });

  describe("GET /api/get/:number", () => {
    it("should return 400 for invalid number param", async () => {
      const res = await request(app).get("/api/get/abc");
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message");
    });

    it("should return 400 for number < 1", async () => {
      const res = await request(app).get("/api/get/0");
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message");
    });

    it("should return data for valid number", async () => {
      sinon
        .stub(getDataFromDbModule, "getDataFromDb")
        .resolves({ success: true, data: [{ foo: "bar" }] });
      const res = await request(app).get("/api/get/1");
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ success: true, data: [{ foo: "bar" }] });
    });
  });

  describe("GET /farming-advice", () => {
    it("should return 500 if dbData is not successful", async () => {
      sinon
        .stub(getDataFromDbModule, "getDataFromDb")
        .resolves({ success: false, data: [] });
      const res = await request(app).get("/farming-advice");
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message");
    });

    it("should return 500 if dbData.data is empty", async () => {
      sinon
        .stub(getDataFromDbModule, "getDataFromDb")
        .resolves({ success: true, data: [] });
      const res = await request(app).get("/farming-advice");
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message");
    });

    it("should return farming advice on success", async () => {
      sinon.stub(getDataFromDbModule, "getDataFromDb").resolves({
        success: true,
        data: [
          {
            temperature: 25,
            humidity: 60,
            soil_moisture: 30,
            rain: false,
            timestamp: "now",
          },
        ],
      });
      sinon
        .stub(getFarmingAdviceModule, "getFarmingAdvice")
        .resolves({ advice: "Water your crops" });
      const res = await request(app).get("/farming-advice");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("advice", "Water your crops");
    });

    it("should handle errors from getFarmingAdvice", async () => {
      sinon.stub(getDataFromDbModule, "getDataFromDb").resolves({
        success: true,
        data: [
          {
            temperature: 25,
            humidity: 60,
            soil_moisture: 30,
            rain: false,
            timestamp: "now",
          },
        ],
      });
      sinon
        .stub(getFarmingAdviceModule, "getFarmingAdvice")
        .rejects(new Error("fail"));
      const res = await request(app).get("/farming-advice");
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message");
    });
  });

  describe("GET /take-action", () => {
    it("should return 500 if dbData is not successful", async () => {
      sinon
        .stub(getDataFromDbModule, "getDataFromDb")
        .resolves({ success: false, data: [] });
      const res = await request(app).get("/take-action");
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message");
    });

    it("should return 500 if dbData.data is empty", async () => {
      sinon
        .stub(getDataFromDbModule, "getDataFromDb")
        .resolves({ success: true, data: [] });
      const res = await request(app).get("/take-action");
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message");
    });

    it("should return action taken on success", async () => {
      sinon.stub(getDataFromDbModule, "getDataFromDb").resolves({
        success: true,
        data: [
          {
            temperature: 25,
            humidity: 60,
            soil_moisture: 30,
            rain: false,
            timestamp: "now",
          },
        ],
      });
      sinon
        .stub(takeIoTActionModule, "takeIoTAction")
        .returns({ do: "something" });
      const res = await request(app).get("/take-action");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "message",
        "Action taken successfully!",
      );
      expect(res.body).to.have.property("action");
    });

    it("should return 500 if action is falsy", async () => {
      sinon.stub(getDataFromDbModule, "getDataFromDb").resolves({
        success: true,
        data: [
          {
            temperature: 25,
            humidity: 60,
            soil_moisture: 30,
            rain: false,
            timestamp: "now",
          },
        ],
      });
      sinon.stub(takeIoTActionModule, "takeIoTAction").returns(null);
      const res = await request(app).get("/take-action");
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message");
    });

    it("should handle errors from takeIoTAction", async () => {
      sinon.stub(getDataFromDbModule, "getDataFromDb").resolves({
        success: true,
        data: [
          {
            temperature: 25,
            humidity: 60,
            soil_moisture: 30,
            rain: false,
            timestamp: "now",
          },
        ],
      });
      sinon
        .stub(takeIoTActionModule, "takeIoTAction")
        .throws(new Error("fail"));
      const res = await request(app).get("/take-action");
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message");
    });
  });

  describe("POST /data/add", () => {
    it("should add data and return 201 on success", async () => {
      sinon.stub(getTimeModule, "getTime").returns("now");
      sinon.stub(addToDbModule, "addDataToDb").resolves({ success: true });
      const res = await request(app).post("/data/add").send({
        temperature: 25,
        humidity: 60,
        soil_moisture: 30,
        soil_raw: 100,
        rain: false,
        rain_raw: 0,
        fire: false,
      });
      expect(res.status).to.equal(201);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Data is Added");
    });

    it("should return 500 if addDataToDb fails", async () => {
      sinon.stub(getTimeModule, "getTime").returns("now");
      sinon
        .stub(addToDbModule, "addDataToDb")
        .resolves({ success: false, error: "fail" });
      const res = await request(app).post("/data/add").send({
        temperature: 25,
        humidity: 60,
        soil_moisture: 30,
        soil_raw: 100,
        rain: false,
        rain_raw: 0,
        fire: false,
      });
      expect(res.status).to.equal(500);
      expect(res.body)
        .to.have.property("message")
        .that.includes("An Error Occurred");
      expect(res.body).to.have.property("error", "fail");
    });

    it("should handle errors in add handler", async () => {
      sinon.stub(getTimeModule, "getTime").returns("now");
      sinon.stub(addToDbModule, "addDataToDb").throws(new Error("fail"));
      const res = await request(app).post("/data/add").send({
        temperature: 25,
        humidity: 60,
        soil_moisture: 30,
        soil_raw: 100,
        rain: false,
        rain_raw: 0,
        fire: false,
      });
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message");
    });
  });

  describe("OPTIONS /", () => {
    it("should respond to OPTIONS requests", async () => {
      const res = await request(app).options("/");
      expect(res.status).to.be.oneOf([200, 204]);
      expect(res.header).to.have.property("access-control-allow-origin", "*");
    });
  });
});
