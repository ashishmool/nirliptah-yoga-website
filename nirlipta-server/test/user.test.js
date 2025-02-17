const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index"); // Ensure the correct path to your app
const { expect } = chai;
const { loginAsAdmin } = require("./mockLogin");

chai.use(chaiHttp);

describe("User API Tests", () => {
    let userId = ""; // Store the user ID
    let adminToken = "";

    before(async function () {
        this.timeout(5000);
        adminToken = await loginAsAdmin();
    });


    // // ✅ Test Get User by ID
    // it("should get a user by ID", async function () {
    //     this.timeout(5000);
    //     if (!userId) this.skip(); // Skip test if user ID is not set
    //
    //     const res = await chai.request(app)
    //         .get(`/api/user/getById/${userId}`);
    //
    //     expect(res).to.have.status(200);
    //     expect(res.body).to.have.property("_id", userId);
    // });

    // // ✅ Test Delete User
    // it("should delete the fetched user", async function () {
    //     this.timeout(5000);
    //     if (!userId) this.skip(); // Skip test if user ID is not set
    //
    //     const res = await chai.request(app)
    //         .delete(`/api/user/delete/${userId}`)
    //         .set("Authorization", `Bearer ${adminToken}`);
    //
    //     expect(res).to.have.status(200);
    //     expect(res.body).to.have.property("message", "User deleted successfully");
    // });
});
