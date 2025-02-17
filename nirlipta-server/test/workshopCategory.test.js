const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index"); // Ensure the correct path to your app
const { expect } = chai;
const { loginAsAdmin } = require("./mockLogin");


// Ensure chai uses chai-http
chai.use(chaiHttp);

describe("Workshop Category API Tests", () => {
    let categoryId = "";
    let adminToken = "";

    // 🔹 Before running tests, log in as an admin and get a token
    before(async function () {
        this.timeout(5000);
        adminToken = await loginAsAdmin();

    });

    // ✅ Test Create Workshop Category
    it("should create a new workshop category", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/api/workshop-categories/save")
            .set("Authorization", `Bearer ${adminToken}`) // Use the stored token
            .field("name", "Test Name")
            .field("description", "Test Description")
            .attach("category_photo", "test/test_photo/test-photo.jpg"); // Ensure this file exists

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("name", "Test Name");
        expect(res.body).to.have.property("description", "Test Description");
        expect(res.body).to.have.property("photo");
        expect(res.body).to.have.property("_id");

        categoryId = res.body._id; // Store the created category ID for further tests
    });

    // ✅ Test Get All Workshop Categories
    it("should get all workshop categories", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .get("/api/workshop-categories");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
    });

    // ✅ Test Get Workshop Category by ID
    it("should get a workshop category by ID", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .get(`/api/workshop-categories/${categoryId}`);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("_id", categoryId);
        expect(res.body).to.have.property("name", "Test Name");
    });

    // ✅ Test Update Workshop Category
    it("should update a workshop category", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .put(`/api/workshop-categories/update/${categoryId}`)
            .set("Authorization", `Bearer ${adminToken}`) // Use the stored token
            .field("name", "Updated Name Test") // Updated name
            .attach("category_photo", "test/test_photo/update-photo-test.jpg"); // Updated photo

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("_id", categoryId);
        expect(res.body).to.have.property("name", "Updated Name Test");
    });

    // ✅ Test Delete Workshop Category
    it("should delete a workshop category", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .delete(`/api/workshop-categories/delete/${categoryId}`)
            .set("Authorization", `Bearer ${adminToken}`); // Use the stored token

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Workshop category deleted");
    });

    // ❌ Test Invalid Workshop Category ID
    it("should return 404 for non-existent workshop category", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .delete("/api/workshop-categories/delete/1234567890abcdef12345678")
            .set("Authorization", `Bearer ${adminToken}`); // Pass the token here
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Workshop category not found");
    });

});
