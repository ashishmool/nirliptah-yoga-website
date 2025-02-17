const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index"); // Ensure this path is correct
const { expect } = chai;
const { loginAsAdmin } = require("./mockLogin");


chai.use(chaiHttp);

describe("Workshop API Tests", () => {
    let workshopId = "";
    let adminToken = ""; // Store the admin token dynamically

    // 🔹 Before running tests, log in as an admin and get a token
    before(async function () {
        this.timeout(5000);
        adminToken = await loginAsAdmin();
    });

    // ✅ Test Create Workshop
    it("should create a new workshop", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/api/workshops/save")
            .field("title", "Test Workshop")
            .field("description", "Test Description")
            .field("difficulty_level", "beginner")
            .field("price", "50")
            .field("discount_price", "40")
            .field("classroom_info", "Online")
            .field("address", "Yoga Center")
            .field("map_location", "123,456")
            .field("category", "678cc19f6da48f186152f5f4") // Valid category ID
            .attach("workshop_photo", "test/test_photo/test-photo.jpg");

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("title", "Test Workshop");
        expect(res.body).to.have.property("_id");

        workshopId = res.body._id;
    });

    // ✅ Test Get All Workshops
    it("should get all workshops", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .get("/api/workshops");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
    });

    // ✅ Test Get Workshop by ID
    it("should get a workshop by ID", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .get(`/api/workshops/${workshopId}`);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("_id", workshopId);
    });

    // ✅ Test Update Workshop
    it("should update a workshop", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .put(`/api/workshops/update/${workshopId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .field("title", "Updated Workshop Title")
            .attach("workshop_photo", "test/test_photo/update-photo-test.jpg");

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("_id", workshopId);
        expect(res.body).to.have.property("title", "Updated Workshop Title");
    });

    // ✅ Test Delete Workshop
    it("should delete a workshop", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .delete(`/api/workshops/delete/${workshopId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Workshop deleted successfully");
    });

    // ❌ Test Invalid Workshop ID
    it("should return 404 for non-existent workshop", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .delete("/api/workshops/delete/1234567890abcdef12345678")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Workshop not found");
    });

});
